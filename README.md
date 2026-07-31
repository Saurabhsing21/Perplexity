# Lumina

> A production-style AI search assistant — tool-calling agent, live web search, cited markdown answers, and streaming UI.

**Author:** [Saurabhsing21](https://github.com/Saurabhsing21)  
**License:** [MIT](LICENSE)

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Runtime    | Bun, Express 5                                  |
| Agent      | `@earendil-works/pi-ai` + OpenRouter            |
| Search     | Tavily API                                      |
| Database   | PostgreSQL + Prisma 7                           |
| Auth       | Supabase (JWT)                                    |
| Frontend   | React 19, Vite 8, assistant-ui, Tailwind CSS 4  |

**Docs:** [Agent Loop](docs/AGENT_LOOP.md) · [Deployment](docs/DEPLOY.md)

## Demo

[![Lumina demo](https://img.youtube.com/vi/-yP0UTrq3FI/maxresdefault.jpg)](https://www.youtube.com/watch?v=-yP0UTrq3FI&autoplay=1)

---

## Table of contents

1. [System overview](#system-overview)
2. [Agent loop](#agent-loop)
3. [Project structure](#project-structure)
4. [Core components](#core-components)
5. [Dependencies](#dependencies)
6. [Quick start](#quick-start)
7. [Commands](#commands)
8. [Configuration](#configuration)
9. [API reference](#api-reference)
10. [Database](#database)
11. [Customization](#customization)

---

## System overview

High-level view of how a user query becomes a streamed, cited answer.

![Architecture diagram](frontend/public/Architecture%20diagram.png)

---

## Agent loop

The agent is **tool-first**: the LLM decides when to search. There is no forced pre-search.

Deep dive → **[docs/AGENT_LOOP.md](docs/AGENT_LOOP.md)**

---

## Project structure

```
lumina/
├── backend/
│   ├── src/
│   │   ├── agent/              # Loop, runner, models, prompt loader
│   │   ├── ask/                # NDJSON helpers, search depth utils
│   │   ├── db/                 # Prisma, user sync, slugs
│   │   ├── middleware/         # JWT auth, credit gate
│   │   ├── routes/             # /ask, /conversations, /me
│   │   ├── search/             # Tavily client
│   │   └── tools/              # web_search tool definition
│   ├── prompts/prompt.md       # System prompt (markdown)
│   └── prisma/schema.prisma
├── frontend/
│   └── src/
│       ├── pages/              # home, auth, thread shell
│       ├── components/         # sources, markdown, agent status
│       ├── lib/                # API client, source utils
│       └── store/              # Zustand global state
└── docs/
    ├── AGENT_LOOP.md
    └── DEPLOY.md
```

---

## Core components

### 1. System prompt

Loaded from markdown at runtime. User queries and history live in **messages**, not the system prompt.

```typescript
// backend/src/agent/prompt-loader.ts
export function getSystemPrompt(): string {
  let prompt = loadPromptTemplate(); // reads prompts/prompt.md
  prompt = prompt.replaceAll("{{CURRENT_DATE}}", new Date().toUTCString());
  prompt += `\n\n${AGENT_INSTRUCTIONS}`; // tool + follow-up instructions
  return prompt;
}
```

```markdown
<!-- backend/prompts/prompt.md (excerpt) -->
# Goal
You are Lumina, a helpful search assistant…

## Format Rules
- Begin with a short summary (no header first)
- Use `## Section` headings with blank lines before/after
- Cite sources inline: `Ice is less dense than water[1][2].`
```

---

### 2. Agent runner

Wires prompt, tools, history, and streaming events.

```typescript
// backend/src/agent/agent-runner.ts
const context: AgentContext = {
  systemPrompt: getSystemPrompt(),
  messages: [...(options.history ?? [])],
  tools: [webSearchTool],
};

const stream = agentLoop([userMessage], context, config, signal, getDefaultStreamFn());

for await (const event of stream) {
  if (event.type === "tool_execution_end" && event.toolName === "web_search") {
    options.onEvent({ type: "sources", items: registry.list() });
  }
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    options.onEvent({ type: "delta", text: event.assistantMessageEvent.delta });
  }
}
```

---

### 3. `web_search` tool

The only agent tool today. Returns numbered snippets the model cites as `[1]`, `[2]`, …

```typescript
// backend/src/tools/web-search.ts
export function createWebSearchTool(defaultDepth, registerResult) {
  return {
    name: "web_search",
    parameters: Type.Object({
      query: Type.String(),
      searchDepth: Type.Optional(Type.Union([
        Type.Literal("basic"),
        Type.Literal("advanced"),
      ])),
    }),
    async execute(_id, params) {
      const results = await webSearch(params.query, params.searchDepth ?? defaultDepth);
      const text = results.map((r) => {
        const { index, title, url } = registerResult?.(r) ?? r;
        return `[${index}] ${title}\nURL: ${url}\n${r.content}`;
      }).join("\n\n");
      return { content: [{ type: "text", text }], details: { results } };
    },
  };
}
```

| `searchMode` (frontend) | Tavily depth |
|-------------------------|--------------|
| `"search"`              | `basic`      |
| `"research"`            | `advanced`   |

---

### 4. NDJSON streaming

One JSON object per line over `POST /ask`.

```typescript
// backend/src/ask/ask-utils.ts
export function writeEvent(res: Response, payload: Record<string, unknown>) {
  res.write(`${JSON.stringify(payload)}\n`);
}
```

```typescript
// frontend/src/lib/api.ts
export async function* askStream(token, { query, model, searchMode, conversationId }) {
  const res = await fetch(`${API_URL}/ask`, { method: "POST", body: JSON.stringify({ ... }) });
  for (const line of (await res.text()).split("\n").filter(Boolean)) {
    yield JSON.parse(line) as AskStreamEvent;
  }
}
```

| Event       | Purpose                          |
|-------------|----------------------------------|
| `delta`     | Answer text chunk                |
| `sources`   | `{ index, title, url, domain }[]`|
| `followups` | Suggested next questions         |
| `done`      | `conversationId`, credits        |
| `error`     | Failure message                  |

Sources persist in the DB as a hidden marker:

```typescript
// Saved assistant message
`${answer}\n\n<!--SOURCES:${JSON.stringify(sources)}-->`
```

---

### 5. Conversation history

Last **20 messages** sent to the LLM. Source markers stripped before the model sees them.

```typescript
// backend/src/agent/agent-runner.ts
export const MAX_HISTORY_MESSAGES = 20;

export function historyFromDbMessages(messages) {
  return messages.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
    role: m.role === "User" ? "user" : "assistant",
    content: m.content.replace(/<!--SOURCES:[\s\S]*?-->\s*$/, "").trimEnd(),
  }));
}
```

---

## Dependencies

### Backend (`backend/package.json`)

| Package | Role |
|---------|------|
| `@earendil-works/pi-ai` | Agent loop, LLM streaming, tool types |
| `@prisma/client` + `@prisma/adapter-pg` | Database ORM (Postgres) |
| `@supabase/supabase-js` | Auth integration |
| `@tavily/core` | Web search API |
| `express` + `cors` | HTTP API |
| `jose` | JWT verification (Supabase JWKS) |
| `pg` | Postgres driver |
| `typebox` | Tool parameter schemas |
| `prisma` (dev) | Schema codegen & migrations |

### Frontend (`frontend/package.json`)

| Package | Role |
|---------|------|
| `@assistant-ui/react` | Chat primitives, local runtime, streaming adapter |
| `@assistant-ui/react-markdown` | Markdown answer rendering |
| `@supabase/supabase-js` | Client auth |
| `@tailwindcss/vite` + `tailwindcss` | Styling (v4) |
| `@tailwindcss/typography` | Prose / answer typography |
| `react` + `react-router` | UI & routing |
| `zustand` | Global state (model, credits, sources) |
| `lucide-react` | Icons |
| `remark-gfm` | GitHub-flavored markdown |
| `vite` (dev) | Build tool |
| `vitest` (dev) | Unit tests |

### External services

| Service | Used for |
|---------|----------|
| **OpenRouter** | LLM inference (`OPENROUTER_API_KEY`) |
| **Tavily** | Web search (`TAVILY_API_KEY`) |
| **Supabase** | Auth + Postgres hosting |
| **PostgreSQL** | Users, conversations, messages, credits |

---

## Quick start

### Prerequisites

- [Bun](https://bun.sh) — backend runtime
- Node 18+ — frontend tooling
- Supabase project (auth + Postgres)
- OpenRouter + Tavily API keys

### Install & run

```bash
git clone <repo-url> lumina && cd lumina

# ── Backend ──────────────────────────────────────────
cd backend
bun install && cp .env.example .env
# Set: TAVILY_API_KEY, OPENROUTER_API_KEY, DATABASE_URL, DIRECT_URL, SUPABASE_URL
bun run db:generate && bun run db:push
bun run dev                    # → http://localhost:3000

# ── Frontend (new terminal) ────────────────────────────
cd frontend
bun install && cp .env.example .env
# Set: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_API_URL
bun run dev                    # → http://localhost:5173
```

Verify the API:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

---

## Commands

### Root (monorepo)

| Command | Description |
|---------|-------------|
| `bun run dev:backend` | API with hot reload |
| `bun run dev:frontend` | Vite dev server |
| `bun run build` | Build backend + frontend |
| `bun run test` | Run all tests |
| `bun run start:backend` | Production API |
| `bun run preview:frontend` | Preview frontend build |

### Backend

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server (`--watch`) |
| `bun run start` | Run `src/index.ts` |
| `bun run build` | Bundle to `dist/` |
| `bun run test` | Bun test runner |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:push` | Push schema to DB |

### Frontend

| Command | Description |
|---------|-------------|
| `bun run dev` | Vite dev server |
| `bun run build` | Production build → `dist/` |
| `bun run preview` | Serve `dist/` locally |
| `bun run test` | Vitest |
| `bun run lint` | oxlint |

---

## Configuration

### Backend environment

```env
# backend/.env
TAVILY_API_KEY=tvly-...
OPENROUTER_API_KEY=sk-or-...
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres
SUPABASE_URL=https://<project>.supabase.co
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend environment

```env
# frontend/.env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_API_URL=http://localhost:3000
```

### Model mapping

```typescript
// backend/src/agent/models.ts
export const AGENT_MODEL_MAP = {
  best:   "openai/gpt-4.1-mini",
  sonar:  "openai/gpt-4.1-mini",
  claude: "anthropic/claude-sonnet-4",
  "gpt-5":"openai/gpt-4o",
  gemini: "google/gemini-2.5-flash",
};
```

---

## API reference

All routes except `/health` require:

```
Authorization: Bearer <supabase_access_token>
```

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/ask` | Stream answer (NDJSON) |
| `GET` | `/me` | Profile + credits |
| `GET` | `/conversations` | List threads |
| `POST` | `/conversations` | Create thread |
| `GET` | `/conversations/:id` | Thread + messages |
| `DELETE` | `/conversations/:id` | Delete thread |

### `POST /ask`

**Request**

```json
{
  "query": "What is attention in transformers?",
  "model": "best",
  "searchMode": "search",
  "conversationId": "optional-uuid"
}
```

**Response** — `Content-Type: application/x-ndjson`

```
{"type":"tool_start","name":"web_search"}
{"type":"status","message":"Searching the web..."}
{"type":"sources","items":[{"index":1,"title":"…","url":"…","domain":"arxiv.org"}]}
{"type":"delta","text":"Attention is a mechanism…"}
{"type":"followups","items":["How does multi-head attention work?"]}
{"type":"done","conversationId":"…","creditsUsed":1,"creditLimit":10}
```

**Credits:** `402 credits_exhausted` when `creditsUsed >= creditLimit` (default limit: 10).

---

## Database

```prisma
// backend/prisma/schema.prisma (simplified)
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  creditsUsed Int      @default(0)
  creditLimit Int      @default(10)
  conversations Conversation[]
}

model Conversation {
  id       String    @id @default(uuid())
  title    String?
  slug     String
  messages Message[]
}

model Message {
  id             Int         @id @default(autoincrement())
  content        String
  role           MessageRole // User | Assistant
  conversationId String
}
```

### Reset dev data

```bash
cd backend && bun run db:reset
```

---

## Customization

| Goal | File(s) |
|------|---------|
| Answer tone & format | `backend/prompts/prompt.md` |
| When to call tools | `AGENT_INSTRUCTIONS` in `prompt-loader.ts` |
| Add agent tool | `backend/src/tools/` → register in `agent-runner.ts` |
| Swap search provider | `backend/src/search/search.ts` |
| Swap LLM provider | `stream-fn.ts`, `models.ts` |
| History window | `MAX_HISTORY_MESSAGES` in `agent-runner.ts` |
| Credit limits | `schema.prisma` + `middleware/credits.ts` |
| Source / citation UI | `frontend/src/components/sources/` |
| Answer typography | `frontend/src/components/assistant-ui/markdown-text.tsx` |

---

## Deploy

Backend and frontend deploy as **two Vercel projects** from the same repo. See **[docs/DEPLOY.md](docs/DEPLOY.md)** for full setup.

| Project | Root directory | `vercel.json` |
|---------|----------------|---------------|
| Frontend | `frontend` | Vite → `dist/` |
| Backend | `backend` | Express → `api/index.js` |

---

## Documentation index

| Document | Contents |
|----------|----------|
| [README.md](README.md) | Overview, architecture, setup, API |
| [docs/AGENT_LOOP.md](docs/AGENT_LOOP.md) | Loop internals, events, tools, testing |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Production deployment guide |

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright © 2026 [Saurabhsing21](https://github.com/Saurabhsing21)
