import type { CodeObj } from "@/shared/api";

export interface CodePathEntry {
  path: string[];
  code: CodeObj;
}

// 関数・ラムダ・内包表記などがあるとネストした code オブジェクトが生まれる。
// bytecode-stage/vm-stage 共通の切り替え UI（タブ）のために
// 「<module> › f」のようなパス付きで平坦化する。
export function flattenCodeObjs(root: CodeObj): CodePathEntry[] {
  const result: CodePathEntry[] = [];

  function visit(code: CodeObj, parentPath: string[]): void {
    const path = [...parentPath, code.name];
    result.push({ path, code });
    for (const child of code.children) {
      visit(child, path);
    }
  }

  visit(root, []);
  return result;
}

export function codePathKey(path: string[]): string {
  return path.join(">");
}
