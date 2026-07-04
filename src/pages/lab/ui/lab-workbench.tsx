"use client";

import { AnalysisProvider } from "@/entities/analysis";
import { AstStage } from "@/widgets/ast-stage";
import { BytecodeStage } from "@/widgets/bytecode-stage";
import { CallSecretCard, TokenLegend, TokenStage } from "@/widgets/token-stage";
import { VmStage } from "@/widgets/vm-stage";
import { Editor } from "./editor";
import { ErrorsBanner } from "./errors-banner";
import { LoadingOverlay } from "./loading-overlay";
import { ModeToggle } from "./mode-toggle";
import { PresetPicker } from "./preset-picker";
import { PythonVersionBadge } from "./python-version-badge";

export interface LabWorkbenchProps {
  initialSource: string;
}

// Pyodide/解析結果に依存する部分だけを 'use client' 境界の内側に置き、
// 静的なヘッダー・教育テキスト・フッタは呼び出し元の RSC に残す
// （クライアントコンポーネントを木の末端に寄せる）。
export function LabWorkbench({ initialSource }: LabWorkbenchProps) {
  return (
    <AnalysisProvider initialSource={initialSource}>
      <LoadingOverlay />
      <div className="card">
        <div className="toolbar">
          <ModeToggle />
          <PythonVersionBadge />
        </div>
        <Editor />
        <PresetPicker />
        <ErrorsBanner />
      </div>
      <TokenStage />
      <TokenLegend />
      <CallSecretCard />
      <AstStage />
      <BytecodeStage />
      <VmStage />
    </AnalysisProvider>
  );
}
