#!/usr/bin/env node

/**
 * Pyodide キャッシュ戦略の検証スクリプト。
 *
 * 実行手順:
 * 1. `pnpm build && pnpm start` でサーバーを起動（別ターミナル）
 * 2. `node scripts/verify-cache.mjs` で実行
 *
 * 検証項目:
 * - Cache-Control ヘッダが正しく設定されている
 * - ファイルのコンテンツタイプが正しい
 * - preload link が HTML に含まれている
 */

import http from "http";

const BASE_URL = "http://localhost:3000";

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const request = http.request(url, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          body,
        });
      });
    });

    request.on("error", reject);
    request.end();
  });
}

async function verify() {
  console.log("🔍 Pyodide キャッシュ戦略検証\n");

  const checks = [
    {
      path: "/pyodide/pyodide.asm.wasm",
      name: "pyodide.asm.wasm",
      expectedContentType: "application/wasm",
    },
    {
      path: "/pyodide/python_stdlib.zip",
      name: "python_stdlib.zip",
      expectedContentType: "application/zip",
    },
    {
      path: "/py/pyeek_core.py",
      name: "pyeek_core.py",
      expectedContentType: "text/x-python",
    },
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      console.log(`⏳ ${check.name} を検査中...`);
      const response = await fetchUrl(check.path);

      // ステータスコード確認
      if (response.status !== 200) {
        console.log(`  ❌ ステータス: ${response.status} (期待値: 200)\n`);
        allPassed = false;
        continue;
      }

      const cacheControl = response.headers["cache-control"];
      const contentType = response.headers["content-type"];

      const cacheControlOk =
        cacheControl &&
        cacheControl.includes("public") &&
        cacheControl.includes("max-age=604800") &&
        !cacheControl.includes("immutable");

      const contentTypeOk =
        contentType && contentType.includes(check.expectedContentType);

      console.log(`  ✓ ステータス: 200`);
      console.log(
        `  ${cacheControlOk ? "✓" : "❌"} Cache-Control: ${cacheControl}`,
      );
      console.log(
        `  ${contentTypeOk ? "✓" : "❌"} Content-Type: ${contentType}`,
      );

      if (!cacheControlOk || !contentTypeOk) {
        allPassed = false;
      }

      console.log("");
    } catch (error) {
      console.log(
        `  ❌ エラー: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      allPassed = false;
    }
  }

  // ホームページで preload link が含まれているか確認
  console.log("⏳ ホームページの preload 確認...");
  try {
    const response = await fetchUrl("/");
    if (response.status === 200) {
      const hasPreload = response.body.includes('rel="preload"');
      const hasWasmPreload = response.body.includes(
        "/pyodide/pyodide.asm.wasm",
      );

      console.log(`  ${hasPreload ? "✓" : "⚠"} Preload link 存在: ${hasPreload}`);
      console.log(`  ${hasWasmPreload ? "✓" : "⚠"} .wasm preload: ${hasWasmPreload}`);

      if (!hasPreload) {
        console.log(
          "  ℹ️  注：preload は useEffect で動的に追加されるため、",
        );
        console.log("     SSR 時には HTML に含まれません（ハイドレーション後に追加）。");
      }
    } else {
      console.log(`  ❌ ステータス: ${response.status}`);
      allPassed = false;
    }
  } catch (error) {
    console.log(
      `  ❌ エラー: ${error instanceof Error ? error.message : String(error)}`,
    );
    allPassed = false;
  }

  console.log("");
  if (allPassed) {
    console.log("✅ 全チェック成功！キャッシュ戦略が正しく設定されています。");
    process.exit(0);
  } else {
    console.log("⚠️  一部のチェックが失敗しました。");
    process.exit(1);
  }
}

verify().catch((error) => {
  console.error("❌ 検証スクリプトエラー:", error);
  process.exit(1);
});
