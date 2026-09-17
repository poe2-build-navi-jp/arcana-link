# ARCANA LINK

## Project

ARCANA LINK is a multilingual collection-card exchange matcher. It is an inventory-based matching tool, not a chronological message board.

## Product invariants

- A server region is required before inventory editing, matching, or publishing.
- Supported internal server IDs are `asia`, `america`, `europe`, and `tw_hk_mo`.
- Never infer server from UI language or UID.
- Cross-server profiles must be excluded completely, not shown as low-scoring matches.
- UI language and server region are independent settings.
- Keep Japanese `/`, English `/en`, and Simplified Chinese `/zh-cn` routes.
- Preserve clear sample-data labels; do not present samples as live listings.
- Keep the X share button label as `Xに共有` in Japanese.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Matching tests are in `tests/matching.test.ts`. Run them after changing server or reciprocal-card matching behavior.

## Architecture

- `components/exchange-home.tsx`: collection, profile, server, matching and share UI
- `lib/matching.ts`: shared pure matching functions
- `lib/server-region.ts`: canonical region IDs and localized labels
- `app/api/profiles/route.ts`: profile read/write API
- `lib/arcana-db.ts`: D1 persistence and legacy region normalization
- `.openai/drizzle/`: D1 migrations
- `cloudflare/worker-wrapper.mjs`: Pages Worker wrapper

## Deployment cautions

- Do not commit credentials or login tokens.
- A different account normally needs a new Sites project and/or D1 database.
- Update `.openai/hosting.json` and `wrangler.json` only after resolving the new project resources.
- Preserve the Google verification routes, AdSense script and `public/ads.txt` unless ownership changes require new values.

