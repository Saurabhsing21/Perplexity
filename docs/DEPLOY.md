# Deploy guide (backend & frontend separately)

No Docker. Deploy the API and the UI as two independent apps.

---

## 1. Backend (API)

### What to host

- Runtime: **Bun** (or Node if you adapt the start command)
- Entry: `backend/src/index.ts`
- Start command: `bun run start` (from `backend/`)
- Port: `PORT` env (default `3000`)
- Health check: `GET /health`

Good hosts: **Railway**, **Render**, **Fly.io**, **VPS** with Bun installed.

### Build / start on the host

```bash
cd backend
bun install
bun run db:generate
bun run db:push    # once per environment (or use migrate in CI)
bun run start
```

Optional production bundle:

```bash
bun run build      # writes dist/
# then: bun run dist/index.js   # only if you prefer the bundle
```

Prefer `bun run start` (runs source directly) unless your host requires a build artifact.

### Backend environment variables

Set these in the host’s env UI (do not commit `.env`):

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | yes | Supabase pooler URL (6543) |
| `DIRECT_URL` | yes | Session/direct URL for Prisma |
| `SUPABASE_URL` | yes | `https://xxxx.supabase.co` |
| `OPENROUTER_API_KEY` | yes | LLM |
| `TAVILY_API_KEY` | yes | Web search |
| `FRONTEND_URL` | yes | Production frontend origin for CORS, e.g. `https://app.example.com` |
| `PORT` | no | Default `3000` |

### After backend is live

1. Note the public API URL, e.g. `https://api.example.com`
2. Confirm `curl https://api.example.com/health` → `{"status":"ok"}`

---

## 2. Frontend (static SPA)

### What to host

- Build: Vite static files in `frontend/dist`
- Build command: `bun run build` (or `npm run build`)
- Output directory: `dist`
- SPA: configure the host to fall back to `index.html` for client routes

Good hosts: **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages** (+ SPA rewrite).

### Build

```bash
cd frontend
bun install
# set VITE_* for production (see below), then:
bun run build
```

`VITE_*` values are **baked in at build time**. Set them in the host’s build env, then rebuild when they change.

### Frontend environment variables (build-time)

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | yes | Same Supabase project as backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes | Publishable / anon key |
| `VITE_API_URL` | yes | Public backend URL, e.g. `https://api.example.com` |
| `VITE_PRICING_URL` | no | Upgrade link |

### Host examples

**Vercel**

- Root directory: `frontend`
- Build: `bun run build` (or `npm run build`)
- Output: `dist` (set automatically via `frontend/vercel.json`)
- Framework: Vite
- Env: set all `VITE_*` in project settings

> If you see *"No Output Directory named build found"*, set **Root Directory** to `frontend` and redeploy. The repo includes `frontend/vercel.json` with `"outputDirectory": "dist"`.

**Netlify**

- Base: `frontend`
- Build: `bun run build`
- Publish: `frontend/dist`
- Redirects for SPA: `/* /index.html 200`

---

## 3. Supabase Auth (required for production)

In the Supabase dashboard → Authentication → URL configuration:

1. **Site URL**: your frontend origin (`https://app.example.com`)
2. **Redirect URLs**: include  
   `https://app.example.com/auth/callback`  
   (and local `http://localhost:5173/auth/callback` for dev)

---

## 4. Checklist

1. Backend env set; `db:generate` + `db:push` done  
2. `GET /health` works on the public API URL  
3. Frontend build env has `VITE_API_URL` pointing at that API  
4. Frontend built and deployed; SPA fallback configured  
5. Supabase redirect URLs match the frontend domain  
6. Backend `FRONTEND_URL` matches the frontend origin (CORS)  
7. Sign in → ask a question → stream works  

---

## 5. Local vs production

| | Local | Production |
|--|--------|------------|
| Frontend | `http://localhost:5173` | your Vercel/Netlify URL |
| Backend | `http://localhost:3000` | your Railway/Render URL |
| `VITE_API_URL` | `http://localhost:3000` | production API URL |
| `FRONTEND_URL` | `http://localhost:5173` | production frontend URL |
