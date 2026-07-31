# Perplexity Clone Frontend

Vite + React Perplexity-style UI.

## Setup

```bash
bun install
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
```

## Run

```bash
bun run dev
```

App runs at `http://localhost:5173`. Requires the backend at `VITE_API_URL` (default `http://localhost:3000`).

## Auth

OAuth via Supabase (Google + GitHub). Configure redirect URL: `http://localhost:5173/auth/callback`.
