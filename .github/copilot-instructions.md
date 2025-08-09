---
applyTo: '*'
description: 'coplilotが必ず従うべきルール'
---

# Copilot Instructions (Repo-wide)

## 返答言語

- 常に日本語で回答してください。コードコメント・コミットメッセージ・PRレビューも日本語を優先。

## コーディング規約（Next.js App Router）

- Next.js（app ディレクトリ）を前提。**Server Componentsをデフォ**、必要なときだけ`"use client"`。
- 取得は`fetch()`の**キャッシュ/再検証**（`{ cache: 'force-cache' | 'no-store', next: { revalidate } }`）を明示。
- ルーティングは`app/`の**ファイル規約**（`page.tsx`, `layout.tsx`, `route.ts` など）を厳守。
- APIは**Route Handlers**（`app/api/**/route.ts`）。処理は極力サーバ側に寄せ、**Server Actions**を検討。
- 型は**TypeScript strict**前提。外部データは**Zod**でスキーマバリデーション。
- クライアントの取得/キャッシュは**TanStack Query**または`use`でのサーバデータ読み込みを選択。重い処理はサーバへ。
- UIは**アクセシビリティ**優先（ラベル付与、ロール、キーボード操作）。フォールバックUIを`Suspense`で提供。
- **ESLint（next/core-web-vitals）＋Prettier**。import alias（`@/`）を利用。
- **Edge Runtime**や**Vercel AI SDK**を使う場合はその前提で最小の追加設定だけを提案。

## コメント

- PRコメントでは**変更理由・影響範囲・代替案**を日本語で要約して提案。
