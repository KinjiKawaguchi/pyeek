// 横スクロールする行コンテナの中で、対象要素が見えるよう scrollLeft だけを
// 調整する。Element.scrollIntoView は縦方向(block)も一緒に動かしてしまい、
// ページ全体が意図せずスクロールする副作用があるため使わない
// (④VM再生でトークンが選択されるたびにページが縦にジャンプし、
// 再生ボタンの画面上の位置がずれる回帰バグの原因になった)。
//
// leftBoundaryWidth: コンテナ左端が sticky な行ラベルで覆われている場合、
// ラベルの幅を渡すと、コンテナ左端+その幅より左には要素を寄せない
// (ラベルの下に隠れるのを防ぐ)。省略時はコンテナ自身の左端を境界にする。
// ラベルの getBoundingClientRect().right ではなく width を使うのは、
// 対象行自身の実幅が現在のスクロール位置より狭く行全体が画面外にある
// 場合、sticky要素は自分が属する行の箱の外には固定されず right の値が
// 崩れるため(幅はスクロール位置に関わらず一定なので安全)。
export function scrollIntoViewHorizontally(
  target: Element,
  container: Element,
  leftBoundaryWidth?: number,
): void {
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const visibleLeft = containerRect.left + (leftBoundaryWidth ?? 0);

  if (targetRect.left < visibleLeft) {
    container.scrollLeft -= visibleLeft - targetRect.left;
  } else if (targetRect.right > containerRect.right) {
    container.scrollLeft += targetRect.right - containerRect.right;
  }
}
