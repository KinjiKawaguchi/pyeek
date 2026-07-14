"use client";

const SHARE_TITLE = "Pyeek — Python が動くまでを見るラボ";

function buildXIntentUrl(url: string): string {
  const params = new URLSearchParams({ text: SHARE_TITLE, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// Web Share API 対応環境（主にモバイル）ではOS標準の共有シートを開き、
// X/LINE等好きな送り先をユーザーに選ばせる。非対応環境（多くのデスクトップ
// ブラウザ）ではXの投稿画面をフォールバックとして開く。
export function ShareSnsButton() {
  const handleClick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: SHARE_TITLE, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }
    window.open(buildXIntentUrl(url), "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" className="share-link" onClick={handleClick}>
      📣 SNSで共有
    </button>
  );
}
