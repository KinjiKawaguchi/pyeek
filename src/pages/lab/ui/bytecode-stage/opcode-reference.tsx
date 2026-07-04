"use client";

import { useState } from "react";
import { OPCODE_REFERENCE_ALL } from "../../config/bytecode-stage/opcode-reference-index";

export function OpcodeReference() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedOpcode, setExpandedOpcode] = useState<string | null>(null);

  return (
    <details className="bytecode-stage__reference">
      <summary>③バイトコードの全種別リファレンス</summary>
      <div className="bytecode-stage__reference-content">
        <div className="bytecode-stage__accuracy-notice">
          <strong>注記:</strong>
          この解説文は正確性を期していますが、誤りが含まれる可能性があります。公式ドキュメント（{" "}
          <a
            href="https://docs.python.org/3.12/library/dis.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs.python.org/3.12/library/dis.html
          </a>
          ）も参照してください。また、Pyeek が出力するバイトコード逆アセンブルには、CPython
          の最適化機構に関連した以下のオペコード種別が決して出現しません: CACHE（PEP 659
          の実行時キャッシュスロット）、INSTRUMENTED_*（PEP 669 の sys.monitoring
          計装命令）、RESERVED（将来予約）、INTERPRETER_EXIT（内部トランポリン）、疑似命令（JUMP /
          LOAD_METHOD 等の中間表現専用）、特殊化命令（BINARY_OP_ADD_INT
          等の適応的最適化変種、実行中の「温め」では反映されない）。バイトコード・AST・実行結果の実装の正確性は常に保証されます。",
        </div>

        <div className="bytecode-stage__categories">
          {OPCODE_REFERENCE_ALL.map((category) => (
            <div key={category.category} className="bytecode-stage__category">
              <button
                type="button"
                className="bytecode-stage__category-header"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.category ? null : category.category,
                  )
                }
              >
                <span className="bytecode-stage__category-toggle">
                  {expandedCategory === category.category ? "▼" : "▶"}
                </span>
                <strong>{category.category}</strong>
                <span className="bytecode-stage__category-desc">{category.description}</span>
              </button>

              {expandedCategory === category.category && (
                <div className="bytecode-stage__opcodes-list">
                  {category.opcodes.map((opcode) => (
                    <div key={opcode.name} className="bytecode-stage__opcode-item">
                      <button
                        type="button"
                        className="bytecode-stage__opcode-header"
                        onClick={() =>
                          setExpandedOpcode(expandedOpcode === opcode.name ? null : opcode.name)
                        }
                      >
                        <span className="bytecode-stage__opcode-toggle">
                          {expandedOpcode === opcode.name ? "▼" : "▶"}
                        </span>
                        <code>{opcode.name}</code>
                      </button>

                      {expandedOpcode === opcode.name && (
                        <div className="bytecode-stage__opcode-content">
                          <div className="bytecode-stage__opcode-detail">
                            <h5>詳細</h5>
                            <p>{opcode.detail}</p>
                          </div>
                          <div className="bytecode-stage__opcode-easy">
                            <h5>初学者向け</h5>
                            <p>{opcode.easy}</p>
                          </div>
                          <div className="bytecode-stage__opcode-reference">
                            <a
                              href={opcode.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bytecode-stage__doc-link"
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
