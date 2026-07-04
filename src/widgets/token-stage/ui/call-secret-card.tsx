"use client";

import { useMemo } from "react";
import { useAnalysis } from "@/entities/analysis";
import { findCallInfo } from "../model/call-info";
import { CallSecretStatus } from "./call-secret-status";

// 前身 token-lab.html の「()のひみつ」教育カード。()の有無で「なまえを
// ゆびさすだけ」か「いま やって！のボタン」かを対比させる、①→次段への
// 教育ブリッジ。
export function CallSecretCard() {
  const { state } = useAnalysis();
  const tokens = state.result?.tokens ?? [];
  const info = useMemo(() => findCallInfo(tokens), [tokens]);
  const hasCall = info.callTokenIndexes.length > 0;

  return (
    <section className="card call-secret" aria-label="()のひみつ">
      <p className="card__title">
        <span className="card__emoji">💡</span> 「()」の ひみつ
      </p>
      <div className="call-secret__compare">
        <div className={`call-secret__machine${!hasCall ? " call-secret__machine--on" : ""}`}>
          <div className="call-secret__code">print</div>
          <div className="call-secret__scene">🍬🎁➡️👉</div>
          <div className="call-secret__say">なまえを ゆびさすだけ</div>
          <div className="call-secret__sub">「これ！」と いってるだけ。まだ うごかない。</div>
        </div>
        <div className={`call-secret__machine${hasCall ? " call-secret__machine--on" : ""}`}>
          <div className="call-secret__code">print()</div>
          <div className="call-secret__scene">🍬🎁➡️✨</div>
          <div className="call-secret__say">ボタンを おした！</div>
          <div className="call-secret__sub">「いま やって！」で、なかみが うごく。</div>
        </div>
      </div>
      <div className="call-secret__punch">
        <span className="call-secret__key">🔑</span> なまえ＝「どれ？」／{" "}
        <b>()＝「いま やって！」の あいず。</b>
        <br />
        だから、わたす ものが <u>なくても</u>、「やって！」の <b>()</b> は つけるんだ。
      </div>
      <CallSecretStatus hasCall={hasCall} bareBuiltin={info.bareBuiltin} />
      {state.mode === "strict" ? (
        <div className="call-secret__lexnote">
          <b>厳密には：</b> 字句解析器（tokenizer）が見ているのは <code>NAME 'print'</code> ・{" "}
          <code>OP '(' (LPAR)</code> ・ <code>OP ')' (RPAR)</code> という並びだけです。これを
          「関数呼び出し」＝ <code>Call(func=Name('print'), args=[])</code> と<b>解釈</b>するのは、
          次の段階の<b>構文解析器（parser）</b>の仕事。
          <br />
          同じ理由で、<code>if</code> や <code>for</code> も字句解析の時点では
          <b>ただの NAME トークン</b>
          で、キーワードかどうかは後の段階で判定されます。
        </div>
      ) : null}
    </section>
  );
}
