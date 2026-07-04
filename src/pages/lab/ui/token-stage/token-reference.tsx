"use client";

import { useState } from "react";
import { TOKEN_REFERENCE_ALL } from "../../config/token-stage/token-reference-index";

export function TokenReference() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  return (
    <details className="token-stage__reference">
      <summary>①トークンの全種別リファレンス</summary>
      <div className="token-stage__reference-content">
        <div className="token-stage__accuracy-notice">
          <strong>注記:</strong>
          この解説文は正確性を期していますが、誤りが含まれる可能性があります。公式ドキュメント（{" "}
          <a
            href="https://docs.python.org/3.12/library/token.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs.python.org/3.12/library/token.html
          </a>
          ）も参照してください。トークン列・AST・バイトコードの実行結果自体は常に正確です。
        </div>

        <div className="token-stage__categories">
          {TOKEN_REFERENCE_ALL.map((category) => (
            <div key={category.category} className="token-stage__category">
              <button
                type="button"
                className="token-stage__category-header"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.category ? null : category.category,
                  )
                }
              >
                <span className="token-stage__category-toggle">
                  {expandedCategory === category.category ? "▼" : "▶"}
                </span>
                <strong>{category.category}</strong>
                <span className="token-stage__category-desc">{category.description}</span>
              </button>

              {expandedCategory === category.category && (
                <div className="token-stage__tokens-list">
                  {category.tokens.map((token) => (
                    <div key={token.name} className="token-stage__token-item">
                      <button
                        type="button"
                        className="token-stage__token-header"
                        onClick={() =>
                          setExpandedToken(expandedToken === token.name ? null : token.name)
                        }
                      >
                        <span className="token-stage__token-toggle">
                          {expandedToken === token.name ? "▼" : "▶"}
                        </span>
                        <code>{token.name}</code>
                      </button>

                      {expandedToken === token.name && (
                        <div className="token-stage__token-content">
                          <div className="token-stage__token-detail">
                            <h5>詳細</h5>
                            <p>{token.detail}</p>
                          </div>
                          <div className="token-stage__token-easy">
                            <h5>初学者向け</h5>
                            <p>{token.easy}</p>
                          </div>
                          <div className="token-stage__token-reference">
                            <a
                              href={token.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="token-stage__doc-link"
                            >
                              公式ドキュメント →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
