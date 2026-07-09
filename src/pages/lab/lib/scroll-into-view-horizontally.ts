// 横スクロールする行コンテナの中で、対象要素が見えるよう scrollLeft だけを
// 調整する。Element.scrollIntoView は縦方向(block)も一緒に動かしてしまい、
// ページ全体が意図せずスクロールする副作用があるため使わない
// (④VM再生でトークンが選択されるたびにページが縦にジャンプし、
// 再生ボタンの画面上の位置がずれる回帰バグの原因になった)。
export function scrollIntoViewHorizontally(target: Element, container: Element): void {
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (targetRect.left < containerRect.left) {
    container.scrollLeft -= containerRect.left - targetRect.left;
  } else if (targetRect.right > containerRect.right) {
    container.scrollLeft += targetRect.right - containerRect.right;
  }
}
