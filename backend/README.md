# Backend

```bash
bun install
cp .env.example .env
# fill secrets
bun run db:generate
bun run db:push
bun run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Watch mode |
| `bun run start` | Production start (`src/index.ts`) |
| `bun run build` | Optional Bun bundle → `dist/` |
| `bun run test` | Unit/integration tests |
| `bun run db:generate` | Prisma client |
| `bun run db:push` | Push schema |

## Layout

```
src/agent/     agent loop + runner
src/tools/     web_search
src/search/    Tavily
src/db/        prisma, user sync
src/routes/    HTTP routes
src/middleware/
prompts/       system prompt markdown
```

Deploy separately from the frontend — see [../docs/DEPLOY.md](../docs/DEPLOY.md).
