"use client";

import type { KeybarKey } from "../config/keybar-keys";
import { KEYBAR_GROUPS } from "../config/keybar-keys";

export interface KeybarProps {
  onKeyPress: (key: KeybarKey) => void;
}

// フォーカス移動(=ソフトウェアキーボードを閉じる操作)だけを抑止する。
// onTouchStart は React がルートに passive リスナーとして登録するため
// preventDefault が効かず、onPointerDown を使う必要がある。
function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
  event.preventDefault();
}

// タッチ端末向けのコード記号キーバー。デスクトップでの表示制御は
// CSS の `(hover: none) and (pointer: coarse)` に任せ、常にDOMに置く
// (SSR/ハイドレーションの整合を保つため)。
export function Keybar({ onKeyPress }: KeybarProps) {
  return (
    <div className="keybar" role="toolbar" aria-label="コード入力補助キー">
      {KEYBAR_GROUPS.map((group, groupIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: グループ配列は静的な定数で並び替わらない
        <div className="keybar__group" key={groupIndex}>
          {groupIndex > 0 ? <span className="keybar__divider" aria-hidden="true" /> : null}
          {group.map((key) => (
            <button
              type="button"
              key={key.label}
              className="keybar__key"
              onPointerDown={handlePointerDown}
              onClick={() => onKeyPress(key)}
            >
              {key.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
