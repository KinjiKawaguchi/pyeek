// URLで共有するコードは lz-string で圧縮する。TypeScript Playground と同じ
// LZString.compressToEncodedURIComponent 方式（圧縮とURI-safeエンコードを
// 同時に行う）。素の URLエンコードよりコードを大きく短縮でき、SNS等での
// 共有に耐えるURL長に収めやすい。
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

export function encodeSharedSource(source: string): string {
  return compressToEncodedURIComponent(source);
}

// 壊れた/改ざんされたURLでもクラッシュせず null を返す（システム境界での
// バリデーション）。呼び出し側は null のとき既定のソースにフォールバックする。
// lz-string は復元失敗時に null を返す仕様だが、型定義上は string のため
// 明示的に null 判定する（空文字列への圧縮は正当な結果であり null 扱いしない）。
export function decodeSharedSource(encoded: string): string | null {
  try {
    const decoded: string | null = decompressFromEncodedURIComponent(encoded);
    return decoded === null ? null : decoded;
  } catch {
    return null;
  }
}
