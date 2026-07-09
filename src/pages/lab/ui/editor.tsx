"use client";

import { type KeyboardEvent, type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import SimpleCodeEditor from "react-simple-code-editor";
import type { KeybarKey } from "../config/keybar-keys";
import { useAnalysis } from "../model/analysis-store";
import { buildHighlightSegments, type HighlightSegment } from "../model/editor/highlight";
import {
  type EditorSelection,
  insertNewlineWithIndent,
  insertTab,
  outdentLines,
} from "../model/editor/indent";
import { insertSnippet } from "../model/editor/insert-snippet";
import { moveCaret } from "../model/editor/move-caret";
import { Keybar } from "./keybar";

const TEXTAREA_ID = "pyeek-editor";

function renderSegments(segments: HighlightSegment[]): ReactNode {
  return segments.map((segment, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: セグメントは毎回丸ごと再生成される静的な表示用配列
    <span key={index} className={segment.category ? `editor-tok--${segment.category}` : undefined}>
      {segment.text}
    </span>
  ));
}

// 4 ステージ共有の唯一のソースエディタ。前身 token-lab.html の
// textarea#code に相当する。シンタックスハイライトは①ステージと同じ
// 本物の tokenize 結果を使い回し、Pyeek 独自の Python 文法は持たない。
export function Editor() {
  const {
    state: { source, result, runtimeError },
    setSource,
  } = useAnalysis();

  const containerRef = useRef<HTMLDivElement>(null);
  const pendingSelection = useRef<EditorSelection | null>(null);

  // setSource → 再レンダーの後でないとテキストが確定しないため、
  // カーソル位置の復元はレイアウト確定後の useLayoutEffect で行う。
  useLayoutEffect(() => {
    if (pendingSelection.current) {
      const { start, end } = pendingSelection.current;
      containerRef.current?.querySelector("textarea")?.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  });

  const applyEdit = (edit: { value: string; selection: EditorSelection }) => {
    pendingSelection.current = edit.selection;
    setSource(edit.value);
  };

  // react-simple-code-editor の型定義は onKeyDown を
  // HTMLAttributes<HTMLDivElement> の同名プロパティと交差させているため、
  // イベント型は両要素を受け付けられる形にしておく必要がある
  // （実際に発火するのは常に内部の textarea 側）。
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    const el = event.currentTarget as HTMLTextAreaElement;
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

  // モバイル向けキーバーのタップは textarea の DOM を直接参照する
  // (react-simple-code-editor はカーソル位置を取得する公開APIを持たないため、
  // handleKeyDown と同じアドホックな参照方法に合わせている)。
  const handleKeybarPress = (key: KeybarKey) => {
    const textarea = containerRef.current?.querySelector("textarea");
    if (!textarea) return;
    if (document.activeElement !== textarea) {
      textarea.focus();
    }
    const selection = { start: textarea.selectionStart, end: textarea.selectionEnd };

    if (key.kind === "move") {
      const next = moveCaret(source, selection, key.direction);
      textarea.setSelectionRange(next.start, next.end);
      return;
    }

    applyEdit(
      key.kind === "tab"
        ? insertTab(source, selection)
        : insertSnippet(source, selection, key.text),
    );
  };

  // 解析結果が今のソースに追いついていない間（debounce待ち）はハイライト
  // せず、素通しのテキストを表示する。古いトークンの位置情報を今のソース
  // に当てはめると範囲がずれるため。
  const segments = useMemo(
    () =>
      result && result.source === source ? buildHighlightSegments(source, result.tokens) : null,
    [result, source],
  );

  return (
    <div className="editor" ref={containerRef}>
      <label className="sr-only" htmlFor={TEXTAREA_ID}>
        Python コード
      </label>
      <SimpleCodeEditor
        value={source}
        onValueChange={setSource}
        onKeyDown={handleKeyDown}
        highlight={() => (segments ? renderSegments(segments) : source)}
        ignoreTabKey
        padding={{ top: 10, right: 12, bottom: 10, left: 12 }}
        textareaId={TEXTAREA_ID}
        textareaClassName="editor__textarea"
        preClassName="editor__pre"
        className="editor__surface"
      />
      <Keybar onKeyPress={handleKeybarPress} />
      {runtimeError ? <p className="editor__error">⚠ {runtimeError}</p> : null}
    </div>
  );
}
