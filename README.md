## auto-save-ph7

卒業制作の一環で、予定調整フォームについて議論した
その際にAIによる自動入力あったら便利そう！ってなったので、作ってみた

<video src="https://github.com/user-attachments/assets/3ac7ee32-de37-496b-9667-9809c1ed64c7"></video>

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
