"use client";

import { type KeyboardEvent, useLayoutEffect, useRef } from "react";
import { useAnalysis } from "../model/analysis-store";
import {
  type EditorSelection,
  insertNewlineWithIndent,
  insertTab,
  outdentLines,
} from "../model/editor/indent";

// 4 ステージ共有の唯一のソースエディタ。前身 token-lab.html の
// textarea#code に相当する（M1 で CSS を移植する）。
export function Editor() {
  const {
    state: { source, runtimeError },
    setSource,
  } = useAnalysis();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<EditorSelection | null>(null);

  // setSource → 再レンダーの後でないとテキストが確定しないため、
  // カーソル位置の復元はレイアウト確定後の useLayoutEffect で行う。
  useLayoutEffect(() => {
    if (pendingSelection.current && textareaRef.current) {
      const { start, end } = pendingSelection.current;
      textareaRef.current.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  });

  const applyEdit = (edit: { value: string; selection: EditorSelection }) => {
    pendingSelection.current = edit.selection;
    setSource(edit.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    const selection = { start: el.selectionStart, end: el.selectionEnd };

    if (event.key === "Tab") {
      event.preventDefault();
      applyEdit(event.shiftKey ? outdentLines(source, selection) : insertTab(source, selection));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      applyEdit(insertNewlineWithIndent(source, selection));
    }
  };

  return (
    <div className="editor">
      <textarea
        ref={textareaRef}
        className="editor__textarea"
        spellCheck={false}
        autoComplete="off"
        aria-label="Python コード"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {runtimeError ? <p className="editor__error">⚠ {runtimeError}</p> : null}
    </div>
  );
}
