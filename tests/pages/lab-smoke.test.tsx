import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisProvider } from "@/entities/analysis";
import { Editor } from "@/pages/lab/ui/editor";
import { PythonVersionBadge } from "@/pages/lab/ui/python-version-badge";
import type { BridgeLoadingState, PyeekBridge, PyeekResult, Token } from "@/shared/api";
import { TokenStage } from "@/widgets/token-stage";

const FAKE_TOKENS: Token[] = [
  {
    type: "NAME",
    exactType: "NAME",
    string: "print",
    start: [1, 0],
    end: [1, 5],
    isKeyword: false,
    isSoftKeyword: false,
  },
  {
    type: "OP",
    exactType: "LPAR",
    string: "(",
    start: [1, 5],
    end: [1, 6],
    isKeyword: false,
    isSoftKeyword: false,
  },
  {
    type: "NUMBER",
    exactType: "NUMBER",
    string: "1",
    start: [1, 6],
    end: [1, 7],
    isKeyword: false,
    isSoftKeyword: false,
  },
  {
    type: "OP",
    exactType: "RPAR",
    string: ")",
    start: [1, 7],
    end: [1, 8],
    isKeyword: false,
    isSoftKeyword: false,
  },
  {
    type: "NEWLINE",
    exactType: "NEWLINE",
    string: "",
    start: [1, 8],
    end: [1, 9],
    isKeyword: false,
    isSoftKeyword: false,
  },
  {
    type: "ENDMARKER",
    exactType: "ENDMARKER",
    string: "",
    start: [2, 0],
    end: [2, 0],
    isKeyword: false,
    isSoftKeyword: false,
  },
];

// Pyodide 抜きのフェイク Bridge。AnalysisProvider が bridge を差し替え可能な
// 設計になっていることを利用し、実際の wasm ロードなしで配線を検証する。
function createFakeBridge(pythonVersion: string): PyeekBridge {
  return {
    async ready(onProgress?: (state: BridgeLoadingState) => void) {
      onProgress?.({ phase: "ready", message: "" });
    },
    async analyzeAll(src: string): Promise<PyeekResult> {
      return {
        source: src,
        pythonVersion,
        tokens: FAKE_TOKENS,
        ast: null,
        bytecode: null,
        errors: [],
      };
    },
  };
}

describe("LabWorkbench の配線（フェイク Bridge）", () => {
  it("初期ソースがエディタに表示される", () => {
    render(
      <AnalysisProvider initialSource="print(1)" bridge={createFakeBridge("3.12.3")}>
        <Editor />
      </AnalysisProvider>,
    );
    expect(screen.getByRole("textbox", { name: "Python コード" })).toHaveValue("print(1)");
  });

  it("解析結果の pythonVersion バッジが表示される", async () => {
    render(
      <AnalysisProvider initialSource="print(1)" bridge={createFakeBridge("3.12.3")}>
        <PythonVersionBadge />
      </AnalysisProvider>,
    );
    await waitFor(() => expect(screen.getByText(/^Python 3\.12\.3$/)).toBeInTheDocument());
  });

  it("TokenStage がトークンのチップを描画する", async () => {
    render(
      <AnalysisProvider initialSource="print(1)" bridge={createFakeBridge("3.12.3")}>
        <TokenStage />
      </AnalysisProvider>,
    );
    await waitFor(() => expect(screen.getByText("print")).toBeInTheDocument());
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
