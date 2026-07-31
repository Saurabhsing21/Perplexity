# Frontend

```bash
bun install
cp .env.example .env
# fill VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_API_URL
bun run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Vite dev server |
| `bun run build` | Production build → `dist/` |
| `bun run preview` | Preview `dist/` |
| `bun run test` | Vitest |

## Layout

```
src/pages/        home, auth, shell
src/components/   sources, markdown, UI
src/lib/          api, sources helpers
src/store/        zustand
src/context/      auth
```

Deploy as a static SPA separately from the backend — see [../docs/DEPLOY.md](../docs/DEPLOY.md).
