## auto-save-ph7

卒業制作の一環で、予定調整フォームについて議論した
その際にAIによる自動入力あったら便利そう！ってなったので、作ってみた

<video src="https://github.com/user-attachments/assets/3ac7ee32-de37-496b-9667-9809c1ed64c7"></video>

## 開発環境のセットアップ

### 必要な拡張機能

このプロジェクトでは以下のVSCode拡張機能を推奨しています：

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **TypeScript Importer** (`ms-vscode.vscode-typescript-next`)

プロジェクトを開くと、VSCodeが自動的にこれらの拡張機能のインストールを提案します。

### 自動フォーマット設定

このプロジェクトでは以下が自動的に実行されます：

- **保存時**: Prettierによる自動フォーマット + ESLintによる自動修正
- **コミット時**: lint-stagedによるコード品質チェック
- **import整理**: 不要なimportの削除とアルファベット順の並び替え

### 利用可能なコマンド

```bash
# ESLintチェック
pnpm run lint

# ESLint自動修正
pnpm run lint:fix

# Prettierフォーマット
pnpm run format

# Prettierチェック
pnpm run format:check
```

## 動作確認

```
pnpm install
cp .env.example .env.local
```

## envの値

openapi key、Google OAuthは各自で発行

NextAuthは以下コマンドを実施して、`AUTH_SECRET`を発行

```
npx auth secret
```

`NEXTAUTH_URL`は`http://localhost:{port番号}/api/auth`
