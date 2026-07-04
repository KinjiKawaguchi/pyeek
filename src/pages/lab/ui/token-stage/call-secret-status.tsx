export interface CallSecretStatusProps {
  hasCall: boolean;
  bareBuiltin: string | null;
}

export function CallSecretStatus({ hasCall, bareBuiltin }: CallSecretStatusProps) {
  if (hasCall) {
    return (
      <div className="call-secret__status">
        <span className="call-secret__status-emoji">✅</span>
        <span>
          いいね！ <b>()</b> があるので「いま やって！」の合図になっています。名前のすぐ後ろの{" "}
          <b>( )</b> が“実行のボタン”です。
        </span>
      </div>
    );
  }

  if (bareBuiltin) {
    return (
      <div className="call-secret__status call-secret__status--warn">
        <span className="call-secret__status-emoji">🤔</span>
        <span>
          <b>{bareBuiltin}</b> は名前を“ゆびさす”だけで、まだ動きません。動かすには{" "}
          <b>{bareBuiltin}()</b> のように <b>()</b> をつけて「やって！」と合図します。
        </span>
      </div>
    );
  }

  return (
    <div className="call-secret__status">
      <span className="call-secret__status-emoji">🙂</span>
      <span>コードを かえると、ここに ヒントが でます。</span>
    </div>
  );
}
