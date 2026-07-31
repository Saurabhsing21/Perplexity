# Perplexity Clone

Monorepo with a Bun/Express backend and a Vite/React frontend. Deploy each app separately.

## Structure

```
perplexity/
  backend/                 # API (Bun + Express + Prisma)
    src/
      agent/               # agent loop, runner, models, prompts loader
      ask/                 # ask helpers
      db/                  # prisma client, user sync, slug
      middleware/          # auth, credits
      routes/              # /ask, /conversations, /me
      search/              # Tavily
      tools/               # web_search tool
    prompts/prompt.md      # system prompt
    prisma/
  frontend/                # Vite + React UI
    src/
      pages/               # home, auth, shell
      components/          # sources, markdown, UI
      lib/ store/ context/
  docs/DEPLOY.md           # separate backend & frontend deploy guide
```

## Local development

```bash
# Backend
cd backend && bun install && cp .env.example .env
# fill env, then:
bun run db:generate && bun run db:push
bun run dev   # http://localhost:3000

# Frontend (new terminal)
cd frontend && bun install && cp .env.example .env
# fill VITE_* vars, then:
bun run dev   # http://localhost:5173
```

From the repo root (after installing in both packages):

```bash
bun run dev:backend
bun run dev:frontend
bun run build
bun run test
```

## Deploy

Backend and frontend are deployed **separately**. See [docs/DEPLOY.md](docs/DEPLOY.md).
