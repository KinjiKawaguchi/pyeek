"use client";

import { toDataURL } from "qrcode";
import { useState } from "react";

// 勉強会・登壇・教室での「この場でスキャンして触ってみて」需要のための
// QRコード表示。エディタの内容は SourceUrlSync が URL の code パラメータに
// 同期しているので、エンコード対象は今のアドレスバーの URL そのままでよい
// （ShareLinkButton と同じ前提）。
export function ShareQrButton() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const handleClick = async () => {
    if (qrDataUrl) {
      setQrDataUrl(null);
      return;
    }
    const dataUrl = await toDataURL(window.location.href, { width: 220, margin: 1 });
    setQrDataUrl(dataUrl);
  };

  return (
    <div className="share-qr">
      <button
        type="button"
        className="share-link"
        aria-expanded={qrDataUrl !== null}
        onClick={handleClick}
      >
        📱 QRコードで共有
      </button>
      {qrDataUrl && (
        <div className="share-qr__popover">
          {/* QRコードは動的生成のdata URLで next/image の最適化対象外のため素の img を使う */}
          <img src={qrDataUrl} alt="このラボを開くQRコード" width={220} height={220} />
        </div>
      )}
    </div>
  );
}
