# dsh-token-stats

Token usage & cost statistics plugin for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) (DSH).

Tracks token consumption per **model**, per **date**, and per **session** with cost estimation in **USD / CNY**,
served as a native page under **Settings → 📊 Token Stats**. Installed as an external DSH plugin, it loads
automatically at DSH startup — no manual activation needed.

[中文说明](./README.zh-CN.md)

## Features

- 📊 Native settings page (dark/light aware, follows DSH theme tokens, i18n zh/en)
- 📈 Daily / weekly / monthly trends with an SVG line chart (zero dependencies)
- 💰 Cost estimation (USD & CNY) from a built-in pricing table for DeepSeek, GPT, Claude, Gemini, Qwen…
- 🔁 History backfill: scans all persisted session logs at startup, so stats survive restarts
- ⚡ Fast: batched session-title reads with an in-memory cache (TTL 5 min), single-pass summaries, memoized pricing
- 📤 CSV / JSON export, filterable by model and session

## Installation

The plugin is installed as an external DSH profile dependency.

1. Clone / copy this repository to a local folder, e.g. `D:\dev\dsh-token-stats`
2. In your DSH profile manifest (`~/.dsh/profiles/web/package.json`):

   ```jsonc
   {
     "dependencies": {
       "dsh-token-stats": "file:D:/dev/dsh-token-stats"
     },
     "dsh": {
       "profile": {
         "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-token-stats"]
       }
     }
   }
   ```

3. `cd ~/.dsh/profiles/web && pnpm install`
4. Restart DSH web. Open **Settings → 📊 Token Stats**.

> `cordis.patch.yml` declares the bundle-layer mount point so the plugin auto-loads at startup.

## How it works

- **Authoritative data** = DSH persisted session logs: `assistant/message` events carry real `usage`
  (input / output / cache-read / cache-write / reasoning tokens), `request/header` events carry provider/model.
- A one-shot backfill at startup (`sessionQuery`) rebuilds the in-memory aggregation index from all history
  (bounded concurrency).
- `llm/stream` usage chunks are captured for live (display-only) in-flight totals.
- When an adapter reports no usage, `tokenMeter.estimateMessage` is used and the record is flagged `estimated`.

## HTTP API (`/token-stats/api`)

| op | description |
| --- | --- |
| `summary` | today / week / month / total aggregates |
| `query` | time series (day/week/month) + per-model / per-session aggregates; filters: `model`, `sessionId`, `from`, `to` |
| `models` | built-in pricing table (USD per 1M tokens) + USD→CNY rate |
| `sessions` | session list (`id` + `title`) |
| `export` | CSV / JSON dump (`format=csv\|json`, optional `model` / `sessionId`) |

## Development

```powershell
node --check index.js      # server half
node --check client.js     # browser half
node test-plugin.js        # standalone mock tests: correctness + performance benchmarks
.\sync-deploy.ps1          # re-sync sources into the DSH profile (then restart DSH web)
```

## Performance

Measured on the author's machine (14 sessions / ~10k records):

| endpoint | before | after |
| --- | --- | --- |
| `sessions` | ~1700 ms (N serial `readTitle` calls) | ~12 ms (one batched `readTitleSnapshots` + cache) |
| `summary` | ~110 ms (4× full-array filters) | <1 ms (single pass) |
| `query` | ~10 ms | ~18 ms at 10k records (memoized cost) |

## License

[MIT](./LICENSE) © 2026 quansheng
