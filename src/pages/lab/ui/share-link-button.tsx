"use client";

import { useState } from "react";

const RESET_DELAY_MS = 2000;

// エディタの内容は SourceUrlSync が URL の code パラメータに同期している
// ので、コピーする対象は今のアドレスバーの URL そのままでよい。
export function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), RESET_DELAY_MS);
  };

  return (
    <button type="button" className="share-link" onClick={handleClick}>
      {copied ? "✅ コピーしました" : "🔗 共有リンクをコピー"}
    </button>
  );
}
