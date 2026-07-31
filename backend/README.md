# perplexity-backend

Bun + Express API for the Perplexity clone.

## Setup

```bash
bun install
cp .env.example .env
# Fill in TAVILY_API_KEY, OPENROUTER_API_KEY, DATABASE_URL, DIRECT_URL, SUPABASE_URL
bun run db:generate
bun run db:push   # use DIRECT_URL if pooler causes prepared-statement errors
```

## Run

```bash
bun run dev
```

Server listens on `http://localhost:3000`.

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/me` | Yes | User profile + credits |
| GET | `/conversations` | Yes | List threads |
| POST | `/conversations` | Yes | Create thread |
| GET | `/conversations/:id` | Yes | Get thread messages |
| DELETE | `/conversations/:id` | Yes | Delete thread |
| POST | `/ask` | Yes | Search + stream answer (NDJSON) |

`POST /ask` returns NDJSON events: `delta`, `sources`, `followups`, `done`. Returns `402` when credits are exhausted.
