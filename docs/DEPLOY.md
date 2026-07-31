# Deploy on Vercel (frontend + backend)

Deploy as **two Vercel projects** from the same GitHub repo.

---

## Overview

| Project | Root directory | URL example |
|---------|----------------|-------------|
| **Frontend** | `frontend` | `https://lumina-web.vercel.app` |
| **Backend** | `backend` | `https://lumina-api.vercel.app` |

The repo includes `frontend/vercel.json` and `backend/vercel.json` so output directories and builds are preconfigured.

---

## 1. Deploy backend (API)

### Vercel project settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Framework Preset** | Other |
| **Build Command** | `bun run vercel-build` |
| **Install Command** | `bun install` |
| **Output Directory** | *(leave empty — serverless `api/index.js`)* |

### Environment variables

Set in Vercel → Project → Settings → Environment Variables:

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | yes |
| `DIRECT_URL` | yes |
| `SUPABASE_URL` | yes |
| `OPENROUTER_API_KEY` | yes |
| `TAVILY_API_KEY` | yes |
| `FRONTEND_URL` | yes — your frontend Vercel URL |

`FRONTEND_URL` can be comma-separated for multiple origins. All `*.vercel.app` preview URLs are allowed automatically for CORS.

### Verify

```bash
curl https://YOUR-BACKEND.vercel.app/health
# {"status":"ok"}
```

### Notes

- `maxDuration` is set to **60s** in `backend/vercel.json` (requires Vercel Pro for long agent runs on Hobby).
- `vercel-build` bundles Express into `api/index.js` and copies `prompts/` for the system prompt.

---

## 2. Deploy frontend (SPA)

### Vercel project settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `bun run build` |
| **Install Command** | `bun install` |
| **Output Directory** | `dist` |

### Environment variables (build-time)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | yes | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes | `sb_publishable_...` |
| `VITE_API_URL` | yes | `https://YOUR-BACKEND.vercel.app` |

Rebuild the frontend whenever `VITE_API_URL` changes.

---

## 3. Supabase Auth

In Supabase → Authentication → URL configuration:

1. **Site URL** → frontend production URL
2. **Redirect URLs** → add:
   - `https://YOUR-FRONTEND.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (local dev)

---

## 4. CLI deploy (preview)

From each package directory:

```bash
# Install CLI once
npm i -g vercel

# Backend preview
cd backend && vercel deploy -y

# Frontend preview
cd frontend && vercel deploy -y
```

Use `vercel deploy --prod -y` only when you want production.

---

## 5. Checklist

- [ ] Backend deployed; `/health` returns OK
- [ ] Frontend `VITE_API_URL` points to backend URL
- [ ] Backend `FRONTEND_URL` points to frontend URL
- [ ] Supabase redirect URLs include frontend `/auth/callback`
- [ ] Sign in → ask a question → stream + sources work

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `No Output Directory named "build" found` | Set root to `frontend`, output to `dist` (or use included `vercel.json`) |
| CORS error | Set `FRONTEND_URL` on backend to your frontend URL |
| `prompt.md not found` | Ensure `vercel-build` runs (not plain `bun run build`) |
| Ask times out | Upgrade Vercel plan or reduce agent complexity; Hobby limit is 10s |
| API 500 on cold start | Check Vercel function logs; confirm all env vars are set |
