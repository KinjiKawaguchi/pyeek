"use client";

import { useState } from "react";
import { AST_REFERENCE_ALL } from "../../config/ast-stage/ast-reference-index";

export function AstReference() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  return (
    <details className="ast-stage__reference">
      <summary>②構文木(AST)の全種別リファレンス</summary>
      <div className="ast-stage__reference-content">
        <div className="ast-stage__accuracy-notice">
          <strong>注記:</strong>
          この解説文は正確性を期していますが、誤りが含まれる可能性があります。公式ドキュメント（{" "}
          <a
            href="https://docs.python.org/3.12/library/ast.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs.python.org/3.12/library/ast.html
          </a>
          ）も参照してください。トークン列・AST・バイトコードの実行結果自体は常に正確です。
        </div>

        <div className="ast-stage__abstract-notice">
          <strong>技術情報:</strong>
          Python の抽象文法（ASDL）には、実際にインスタンス化されない「グループ型」があります。
          例えば、<code>operator</code> グループには <code>Add</code>、<code>Sub</code>、
          <code>Mult</code>
          などの具象型が属しており、リファレンスでは具象型のみ個別に掲載しています。 また、
          <code>Num</code>、<code>Str</code>、<code>NameConstant</code>{" "}
          などの廃止予定レガシーエイリアスや、
          <code>AugLoad</code>、<code>Param</code> などの未使用コンテキスト型は対象外です。 さらに、
          <code>Interactive</code>、<code>Expression</code>、<code>FunctionType</code> は、
          <code>mode=&apos;single&apos;</code>、<code>mode=&apos;eval&apos;</code>、
          <code>mode=&apos;func_type&apos;</code> で<code>ast.parse()</code>{" "}
          を呼んだ場合のみ生成されるため、Pyeek（デフォルト
          <code>mode=&apos;exec&apos;</code>、常に <code>Module</code>{" "}
          をルートにする）のUI上では決して出現しません。
        </div>

        <div className="ast-stage__categories">
          {AST_REFERENCE_ALL.map((category) => (
            <div key={category.category} className="ast-stage__category">
              <button
                type="button"
                className="ast-stage__category-header"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.category ? null : category.category,
                  )
                }
              >
                <span className="ast-stage__category-toggle">
                  {expandedCategory === category.category ? "▼" : "▶"}
                </span>
                <strong>{category.category}</strong>
                <span className="ast-stage__category-desc">{category.description}</span>
              </button>

              {expandedCategory === category.category && (
                <div className="ast-stage__nodes-list">
                  {category.nodes.map((node) => (
                    <div key={node.name} className="ast-stage__node-item">
                      <button
                        type="button"
                        className="ast-stage__node-header"
                        onClick={() =>
                          setExpandedNode(expandedNode === node.name ? null : node.name)
                        }
                      >
                        <span className="ast-stage__node-toggle">
                          {expandedNode === node.name ? "▼" : "▶"}
                        </span>
                        <code>{node.name}</code>
                      </button>

                      {expandedNode === node.name && (
                        <div className="ast-stage__node-content">
                          <div className="ast-stage__node-detail">
                            <h5>詳細</h5>
                            <p>{node.detail}</p>
                          </div>
                          <div className="ast-stage__node-easy">
                            <h5>初学者向け</h5>
                            <p>{node.easy}</p>
                          </div>
                          <div className="ast-stage__node-reference">
                            <a
                              href={node.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ast-stage__doc-link"
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
