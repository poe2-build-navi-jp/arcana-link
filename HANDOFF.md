# ARCANA LINK 引き継ぎガイド

このフォルダーは ARCANA LINK のソース一式です。Claude Code または別の ChatGPT/Codex アカウントへ、フォルダーごと渡してください。

## 現在の公開先

- https://arcana-card-link.pages.dev/
- 収録ソース: `codex/arcana-v2` のコミット `5cd9bc2`

## 技術構成

- React 19 / TypeScript
- Vinext / Vite
- Cloudflare Pages + Worker
- Cloudflare D1（募集プロフィール・通報）
- pnpm

## ローカル起動

必要環境は Node.js 22.13 以上です。

```bash
pnpm install
pnpm dev
```

本番ビルド:

```bash
pnpm build
```

## 別アカウントで公開するとき

1. Cloudflare または Sites の新しいプロジェクトを作成します。
2. D1データベースを作成し、`.openai/drizzle/`のマイグレーションを適用します。
3. `wrangler.json`の`database_id`を、新しいD1のIDへ変更します。
4. OpenAI Sitesを使う場合は、`.openai/hosting.json`の`project_id`を新しいアカウントのプロジェクトIDへ変更します。
5. ビルド後、`cloudflare/worker-wrapper.mjs`をWorker入口としてPagesへ公開します。

現在の`.openai/hosting.json`と`wrangler.json`にあるプロジェクトID・データベースIDは秘密鍵ではありませんが、別アカウントから同じリソースへアクセスできるとは限りません。新しいアカウント側で作り直すのが安全です。

## 引き継がれる機能

- 22種類のカード所持数管理
- 同一サーバー限定の相互マッチング
- Asia / America / Europe / TW・HK・MO
- 募集状態とUIDコピー
- X共有
- 日本語・英語・簡体字中国語
- 22種類のSEOページ、サイトマップ、robots.txt
- Search Console確認用URL
- AdSenseタグと`ads.txt`

## データについて

DBスキーマとマイグレーションは含まれますが、公開D1内の利用者データやアカウントのログイン情報は含まれません。端末内の`localStorage`データも移行されません。

## ZIPに含めていないもの

- `node_modules/`（`pnpm install`で再生成）
- `dist/`、`.next/`などのビルド生成物
- Cloudflare、Google、OpenAIなどのログイン情報・秘密鍵
- Git履歴（現在の完成ソースだけを収録）

## 最初に確認するファイル

- `components/exchange-home.tsx` — メイン画面と操作
- `lib/matching.ts` — マッチング判定
- `lib/server-region.ts` — サーバー定義
- `app/api/profiles/route.ts` — 募集API
- `lib/arcana-db.ts` / `db/schema.ts` — D1処理とスキーマ
- `app/layout.tsx` / `lib/site-metadata.ts` — SEOと広告
- `wrangler.json` / `.openai/hosting.json` — 公開設定
- `tests/matching.test.ts` — マッチングテスト

