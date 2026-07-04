"""pyeek_core.analyze_all のスナップショットテスト。

CPython 本物の tokenize/ast/dis 出力に対する回帰検知が目的。スナップショットを
更新するときは `PYEEK_UPDATE_SNAPSHOTS=1 uv run pytest tests/python/` で再生成する。
"""

import json
import os
from pathlib import Path

import pytest

import pyeek_core

SNAPSHOT_DIR = Path(__file__).parent / "snapshots"
UPDATE_SNAPSHOTS = os.environ.get("PYEEK_UPDATE_SNAPSHOTS") == "1"

# tests/fixtures/cases.json は tests/bridge/pyodide-node.test.ts（Node 上で
# 本物の Pyodide を動かす版ズレ検出テスト）と共有する唯一の情報源。
# CPython は定数のみの式を畳み込むため、"constant_folding" は BINARY_OP が
# 消えて RETURN_CONST だけになる（③のくわしいモードで見せる題材）。④a の
# デモには変数を挟んだ "vm_demo" を使う。
CASES: dict[str, str] = json.loads(
    (Path(__file__).parents[1] / "fixtures" / "cases.json").read_text()
)


def _snapshot_path(name: str) -> Path:
    return SNAPSHOT_DIR / f"{name}.json"


@pytest.mark.parametrize("name", sorted(CASES))
def test_analyze_all_matches_snapshot(name: str) -> None:
    actual = pyeek_core.analyze_all(CASES[name])
    path = _snapshot_path(name)

    if UPDATE_SNAPSHOTS:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(actual, indent=2, ensure_ascii=False, sort_keys=True) + "\n")
        pytest.skip(f"snapshot updated: {path}")

    if not path.exists():
        pytest.fail(f"snapshot missing — PYEEK_UPDATE_SNAPSHOTS=1 で作成してください: {path}")

    expected = json.loads(path.read_text())
    assert actual == expected


def test_analyze_all_json_round_trips() -> None:
    dumped = pyeek_core.analyze_all_json("x = 1")
    assert json.loads(dumped) == pyeek_core.analyze_all("x = 1")


def test_broken_input_keeps_partial_tokens() -> None:
    result = pyeek_core.analyze_all(CASES["syntax_error_paren"])
    assert len(result["tokens"]) > 0
    assert result["ast"] is None
    assert result["bytecode"] is None
    assert {e["stage"] for e in result["errors"]} == {1, 2, 3}
