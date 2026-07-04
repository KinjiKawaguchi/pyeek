"""Pyeek のオラクル層。

ソースコード文字列を受け取り、CPython 自身の tokenize / ast / dis / compile が
生成する内部表現をそのまま JSON 互換の dict/list に変換して返す、副作用のない
純粋関数群。フロントエンドはこのモジュールの外形（analyze_all_json の戻り値）
にのみ依存し、CPython の内部 API には触れない。

標準ライブラリのみを使用する（Pyodide 上でも追加インストール不要にするため）。
"""

from __future__ import annotations

import ast
import dis
import io
import json
import keyword
import sys
import tokenize as _tokenize
from types import CodeType

# ---------------------------------------------------------------------------
# errors
# ---------------------------------------------------------------------------


def _error(
    stage: int,
    kind: str,
    msg: str,
    lineno: int | None = None,
    offset: int | None = None,
) -> dict:
    return {"stage": stage, "type": kind, "msg": msg, "lineno": lineno, "offset": offset}


def _token_error_position(exc: _tokenize.TokenError) -> tuple[int | None, int | None]:
    # tokenize.TokenError.args は (message, (lineno, offset)) の形。
    position = exc.args[1] if len(exc.args) > 1 else None
    if isinstance(position, tuple) and len(position) == 2:
        return position[0], position[1]
    return None, None


# ---------------------------------------------------------------------------
# ① tokens
# ---------------------------------------------------------------------------


def _token_to_dict(tok: _tokenize.TokenInfo) -> dict:
    is_name = tok.type == _tokenize.NAME
    return {
        "type": _tokenize.tok_name[tok.type],
        "exactType": _tokenize.tok_name[tok.exact_type],
        "string": tok.string,
        "start": list(tok.start),
        "end": list(tok.end),
        "isKeyword": is_name and keyword.iskeyword(tok.string),
        "isSoftKeyword": is_name and keyword.issoftkeyword(tok.string),
    }


def analyze_tokens(src: str) -> dict:
    """CPython 本物の tokenize.generate_tokens をそのまま JSON 化する。

    壊れた入力（未完成の三重引用符・不整合な dedent 等）でも、エラーが起きる
    直前までのトークンは保持して返す（ライブ編集中は未完成コードが常態のため）。
    """
    tokens: list[dict] = []
    errors: list[dict] = []
    readline = io.StringIO(src).readline
    try:
        for tok in _tokenize.generate_tokens(readline):
            tokens.append(_token_to_dict(tok))
    except _tokenize.TokenError as exc:
        lineno, offset = _token_error_position(exc)
        errors.append(_error(1, "TokenError", exc.args[0], lineno, offset))
    except (IndentationError, SyntaxError) as exc:
        errors.append(_error(1, type(exc).__name__, exc.msg, exc.lineno, exc.offset))
    return {"tokens": tokens, "errors": errors}


# ---------------------------------------------------------------------------
# ② AST
# ---------------------------------------------------------------------------

_POSITION_FIELDS = ("lineno", "col_offset", "end_lineno", "end_col_offset")


def _ast_label(node: ast.AST, fields: dict[str, str]) -> str:
    """`Name(id='x')` のような短い一行ラベル（ast.dump 相当だが子ノードは含めない）。"""
    inline = ", ".join(f"{key}={value}" for key, value in fields.items())
    return f"{type(node).__name__}({inline})" if inline else type(node).__name__


def _ast_node_to_dict(node: ast.AST, next_id: "_Counter") -> dict:
    node_id = next_id()
    fields: dict[str, str] = {}
    children: list[dict] = []

    for field_name, value in ast.iter_fields(node):
        if field_name in _POSITION_FIELDS:
            continue
        _classify_ast_field(field_name, value, fields, children, next_id)

    positions = {name: getattr(node, name, None) for name in _POSITION_FIELDS}
    return {
        "id": node_id,
        "type": type(node).__name__,
        "label": _ast_label(node, fields),
        "fields": fields,
        "lineno": positions["lineno"],
        "colOffset": positions["col_offset"],
        "endLineno": positions["end_lineno"],
        "endColOffset": positions["end_col_offset"],
        "children": children,
    }


def _classify_ast_field(
    field_name: str,
    value: object,
    fields: dict[str, str],
    children: list[dict],
    next_id: "_Counter",
) -> None:
    if isinstance(value, ast.AST):
        children.append({"field": field_name, "node": _ast_node_to_dict(value, next_id)})
    elif isinstance(value, list) and value and isinstance(value[0], ast.AST):
        for item in value:
            children.append({"field": field_name, "node": _ast_node_to_dict(item, next_id)})
    elif value is not None or field_name not in ("type_comment",):
        fields[field_name] = repr(value)


class _Counter:
    """AST ノードへの一意 id 採番（クロージャで十分だが型を明示するための薄いラッパー）。"""

    def __init__(self) -> None:
        self._value = 0

    def __call__(self) -> int:
        current = self._value
        self._value += 1
        return current


def analyze_ast(src: str) -> dict:
    try:
        tree = ast.parse(src)
    except SyntaxError as exc:
        return {"ast": None, "errors": [_error(2, type(exc).__name__, exc.msg, exc.lineno, exc.offset)]}
    return {"ast": _ast_node_to_dict(tree, _Counter()), "errors": []}


# ---------------------------------------------------------------------------
# ③ bytecode
# ---------------------------------------------------------------------------

_JUMP_OPCODES = frozenset(dis.hasjrel) | frozenset(dis.hasjabs)


def _stack_effect_safe(opcode: int, arg: int | None) -> int | None:
    try:
        return dis.stack_effect(opcode, arg)
    except ValueError:
        return None


def _positions_to_dict(positions: dis.Positions | None) -> dict | None:
    if positions is None:
        return None
    return {
        "lineno": positions.lineno,
        "endLineno": positions.end_lineno,
        "colOffset": positions.col_offset,
        "endColOffset": positions.end_col_offset,
    }


def _argrepr(instr: dis.Instruction) -> str:
    # ネストしたコードオブジェクトを積む LOAD_CONST は、既定の repr() だと
    # メモリアドレスを含み実行のたびに変わってしまう（再現性がなくスナップ
    # ショットテストも壊れる）ため、コード名だけの安定した表記に差し替える。
    if isinstance(instr.argval, CodeType):
        return f"<code {instr.argval.co_name}>"
    return instr.argrepr


def _instr_to_dict(instr: dis.Instruction) -> dict:
    is_jump = instr.opcode in _JUMP_OPCODES
    return {
        "offset": instr.offset,
        "opname": instr.opname,
        "arg": instr.arg,
        "argrepr": _argrepr(instr),
        "positions": _positions_to_dict(instr.positions),
        "isJumpTarget": instr.is_jump_target,
        "isJump": is_jump,
        # ジャンプ命令の argval は絶対ターゲットバイトオフセット。
        # argrepr の "to 42" のような文字列をパースするより確実。
        "jumpTarget": instr.argval if is_jump else None,
        "stackEffect": _stack_effect_safe(instr.opcode, instr.arg),
    }


def _code_to_dict(code: CodeType) -> dict:
    instructions = [_instr_to_dict(instr) for instr in dis.Bytecode(code)]
    children = [_code_to_dict(const) for const in code.co_consts if isinstance(const, CodeType)]
    return {
        "name": code.co_name,
        "instructions": instructions,
        "consts": [repr(c) for c in code.co_consts if not isinstance(c, CodeType)],
        "varnames": list(code.co_varnames),
        "names": list(code.co_names),
        "children": children,
    }


def analyze_bytecode(src: str) -> dict:
    try:
        code = compile(src, "<pyeek>", "exec")
    except SyntaxError as exc:
        return {
            "bytecode": None,
            "errors": [_error(3, type(exc).__name__, exc.msg, exc.lineno, exc.offset)],
        }
    return {"bytecode": _code_to_dict(code), "errors": []}


# ---------------------------------------------------------------------------
# public entry points
# ---------------------------------------------------------------------------


def analyze_all(src: str) -> dict:
    tokens_result = analyze_tokens(src)
    ast_result = analyze_ast(src)
    bytecode_result = analyze_bytecode(src)
    errors = [*tokens_result["errors"], *ast_result["errors"], *bytecode_result["errors"]]
    return {
        "source": src,
        "pythonVersion": sys.version.split()[0],
        "tokens": tokens_result["tokens"],
        "ast": ast_result["ast"],
        "bytecode": bytecode_result["bytecode"],
        "errors": errors,
    }


def analyze_all_json(src: str) -> str:
    """JS との境界。PyProxy の deep 変換を避けるため JSON 文字列として返す。"""
    return json.dumps(analyze_all(src))
