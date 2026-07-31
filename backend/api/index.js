var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// vercel-entry.ts
var exports_vercel_entry = {};
__export(exports_vercel_entry, {
  default: () => vercel_entry_default
});
module.exports = __toCommonJS(exports_vercel_entry);

// src/app.ts
var import_express4 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/routes/ask.ts
var import_express2 = require("express");

// src/middleware/auth.ts
var import_jose = require("jose");

// src/db/prisma.ts
var import_config = require("dotenv/config");

// prisma/generated/client.ts
var path = __toESM(require("node:path"));
var import_node_url = require("node:url");

// prisma/generated/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"));
var config = {
  previewFeatures: [],
  clientVersion: "7.9.1",
  engineVersion: "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  activeProvider: "postgresql",
  inlineSchema: `generator client {
  provider   = "prisma-client"
  output     = "./generated"
  engineType = "client"
  runtime    = "nodejs"
}

datasource db {
  provider = "postgresql"
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  provider      AuthProvider
  supabaseId    String         @unique
  name          String
  creditsUsed   Int            @default(0)
  creditLimit   Int            @default(10)
  plan          Plan           @default(Free)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  conversations Conversation[]
  creditUsages  CreditUsage[]
}

model Conversation {
  id        String    @id @default(uuid())
  title     String?
  slug      String
  userId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Message {
  id             Int          @id @default(autoincrement())
  content        String
  role           MessageRole
  conversationId String
  createdAt      DateTime     @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}

model CreditUsage {
  id        String   @id @default(uuid())
  userId    String
  action    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum MessageRole {
  User
  Assistant
}

enum AuthProvider {
  Github
  Google
}

enum Plan {
  Free
  Pro
}
`,
  runtimeDataModel: {
    models: {},
    enums: {},
    types: {}
  },
  parameterizationSchema: {
    strings: [],
    graph: ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"AuthProvider"},{"name":"supabaseId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"creditsUsed","kind":"scalar","type":"Int"},{"name":"creditLimit","kind":"scalar","type":"Int"},{"name":"plan","kind":"enum","type":"Plan"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"conversations","kind":"object","type":"Conversation","relationName":"ConversationToUser"},{"name":"creditUsages","kind":"object","type":"CreditUsage","relationName":"CreditUsageToUser"}],"dbName":null},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"user","kind":"object","type":"User","relationName":"ConversationToUser"}],"dbName":null},"Message":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"content","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"MessageRole"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"}],"dbName":null},"CreditUsage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CreditUsageToUser"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","conversation","messages","user","_count","conversations","creditUsages","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","CreditUsage.findUnique","CreditUsage.findUniqueOrThrow","CreditUsage.findFirst","CreditUsage.findFirstOrThrow","CreditUsage.findMany","CreditUsage.createOne","CreditUsage.createMany","CreditUsage.createManyAndReturn","CreditUsage.updateOne","CreditUsage.updateMany","CreditUsage.updateManyAndReturn","CreditUsage.upsertOne","CreditUsage.deleteOne","CreditUsage.deleteMany","CreditUsage.groupBy","CreditUsage.aggregate","AND","OR","NOT","id","userId","action","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","content","MessageRole","role","conversationId","title","slug","updatedAt","email","AuthProvider","provider","supabaseId","name","creditsUsed","creditLimit","Plan","plan","every","some","none","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "9AEnQA8HAACMAQAgCAAAjQEAIFEAAIYBADBSAAATABBTAACGAQAwVAEAAAABV0AAiwEAIWlAAIsBACFqAQAAAAFsAACIAWwibQEAAAABbgEAhwEAIW8CAIkBACFwAgCJAQAhcgAAigFyIgEAAAABACALBAAAlQEAIAUAAI8BACBRAACTAQAwUgAAAwAQUwAAkwEAMFQBAIcBACFVAQCHAQAhV0AAiwEAIWcBAJQBACFoAQCHAQAhaUAAiwEAIQMEAADiAQAgBQAA4AEAIGcAAKYBACALBAAAlQEAIAUAAI8BACBRAACTAQAwUgAAAwAQUwAAkwEAMFQBAAAAAVUBAIcBACFXQACLAQAhZwEAlAEAIWgBAIcBACFpQACLAQAhAwAAAAMAIAEAAAQAMAIAAAUAIAkDAACSAQAgUQAAkAEAMFIAAAcAEFMAAJABADBUAgCJAQAhV0AAiwEAIWMBAIcBACFlAACRAWUiZgEAhwEAIQEDAADhAQAgCQMAAJIBACBRAACQAQAwUgAABwAQUwAAkAEAMFQCAAAAAVdAAIsBACFjAQCHAQAhZQAAkQFlImYBAIcBACEDAAAABwAgAQAACAAwAgAACQAgAQAAAAcAIAgFAACPAQAgUQAAjgEAMFIAAAwAEFMAAI4BADBUAQCHAQAhVQEAhwEAIVYBAIcBACFXQACLAQAhAQUAAOABACAIBQAAjwEAIFEAAI4BADBSAAAMABBTAACOAQAwVAEAAAABVQEAhwEAIVYBAIcBACFXQACLAQAhAwAAAAwAIAEAAA0AMAIAAA4AIAEAAAADACABAAAADAAgAQAAAAEAIA8HAACMAQAgCAAAjQEAIFEAAIYBADBSAAATABBTAACGAQAwVAEAhwEAIVdAAIsBACFpQACLAQAhagEAhwEAIWwAAIgBbCJtAQCHAQAhbgEAhwEAIW8CAIkBACFwAgCJAQAhcgAAigFyIgIHAADeAQAgCAAA3wEAIAMAAAATACABAAAUADACAAABACADAAAAEwAgAQAAFAAwAgAAAQAgAwAAABMAIAEAABQAMAIAAAEAIAwHAADcAQAgCAAA3QEAIFQBAAAAAVdAAAAAAWlAAAAAAWoBAAAAAWwAAABsAm0BAAAAAW4BAAAAAW8CAAAAAXACAAAAAXIAAAByAgEOAAAYACAKVAEAAAABV0AAAAABaUAAAAABagEAAAABbAAAAGwCbQEAAAABbgEAAAABbwIAAAABcAIAAAABcgAAAHICAQ4AABoAMAEOAAAaADAMBwAAwgEAIAgAAMMBACBUAQCZAQAhV0AAmgEAIWlAAJoBACFqAQCZAQAhbAAAwAFsIm0BAJkBACFuAQCZAQAhbwIAowEAIXACAKMBACFyAADBAXIiAgAAAAEAIA4AAB0AIApUAQCZAQAhV0AAmgEAIWlAAJoBACFqAQCZAQAhbAAAwAFsIm0BAJkBACFuAQCZAQAhbwIAowEAIXACAKMBACFyAADBAXIiAgAAABMAIA4AAB8AIAIAAAATACAOAAAfACADAAAAAQAgFQAAGAAgFgAAHQAgAQAAAAEAIAEAAAATACAFBgAAuwEAIBsAALwBACAcAAC_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-ACAeAAB-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-AAABACADFQAA8AEAIHgAAPEBACB-AAABACAAAAAAAAF7AAAAZQIFewIAAAABgQECAAAAAYIBAgAAAAGDAQIAAAABhAECAAAAAQUVAADrAQAgFgAA7gEAIHgAAOwBACB5AADtAQAgfgAABQAgAxUAAOsBACB4AADsAQAgfgAABQAgAAAAAAF7AQAAAAELFQAArQEAMBYAALIBADB4AACuAQAweQAArwEAMHoAALABACB7AACxAQAwfAAAsQEAMH0AALEBADB-AACxAQAwfwAAswEAMIABAAC0AQAwBRUAAOUBACAWAADpAQAgeAAA5gEAIHkAAOgBACB-AAABACAEVAIAAAABV0AAAAABYwEAAAABZQAAAGUCAgAAAAkAIBUAALgBACADAAAACQAgFQAAuAEAIBYAALcBACABDgAA5wEAMAkDAACSAQAgUQAAkAEAMFIAAAcAEFMAAJABADBUAgAAAAFXQACLAQAhYwEAhwEAIWUAAJEBZSJmAQCHAQAhAgAAAAkAIA4AALcBACACAAAAtQEAIA4AALYBACAIUQAAtAEAMFIAALUBABBTAAC0AQAwVAIAiQEAIVdAAIsBACFjAQCHAQAhZQAAkQFlImYBAIcBACEIUQAAtAEAMFIAALUBABBTAAC0AQAwVAIAiQEAIVdAAIsBACFjAQCHAQAhZQAAkQFlImYBAIcBACEEVAIAowEAIVdAAJoBACFjAQCZAQAhZQAAogFlIgRUAgCjAQAhV0AAmgEAIWMBAJkBACFlAACiAWUiBFQCAAAAAVdAAAAAAWMBAAAAAWUAAABlAgQVAACtAQAweAAArgEAMHoAALABACB-AACxAQAwAxUAAOUBACB4AADmAQAgfgAAAQAgAAAAAAABewAAAGwCAXsAAAByAgsVAADQAQAwFgAA1QEAMHgAANEBADB5AADSAQAwegAA0wEAIHsAANQBADB8AADUAQAwfQAA1AEAMH4AANQBADB_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-UAc_UxpAVCBBVQVCVgVDVwVEWAVFWQVGWwVHXQdIXiFJYAVKYgdLYyJMZAVNZQVOZgdPaSNQaic"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("node:buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/internal/prismaNamespace.ts
var runtime2 = __toESM(require("@prisma/client/runtime/client"));
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/client.ts
globalThis["__dirname"] = path.dirname(import_node_url.fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/db/prisma.ts
var import_adapter_pg = require("@prisma/adapter-pg");
var import_pg = __toESM(require("pg"));
var globalForPrisma = globalThis;
function createPrismaClient() {
  const pool = new import_pg.default.Pool({
    connectionString: process.env.DATABASE_URL
  });
  const adapter = new import_adapter_pg.PrismaPg(pool);
  return new PrismaClient({ adapter });
}
var prisma = globalForPrisma.prisma ?? createPrismaClient();
if (true) {
  globalForPrisma.prisma = prisma;
}

// src/db/user-sync.ts
function mapProvider(provider) {
  if (provider === "github")
    return "Github";
  return "Google";
}
async function upsertUserFromSupabase(supabaseUser) {
  const email = supabaseUser.email ?? `${supabaseUser.id}@users.local`;
  const name = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.user_name ?? email.split("@")[0] ?? "User";
  const provider = mapProvider(supabaseUser.app_metadata?.provider);
  return prisma.user.upsert({
    where: { supabaseId: supabaseUser.id },
    update: {
      email,
      name,
      provider
    },
    create: {
      supabaseId: supabaseUser.id,
      email,
      name,
      provider
    }
  });
}

// src/middleware/auth.ts
var supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
var jwks = supabaseUrl ? import_jose.createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)) : null;
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "unauthorized", message: "Missing auth token" });
    }
    if (!jwks) {
      return res.status(500).json({ error: "server_misconfigured", message: "SUPABASE_URL is not set" });
    }
    const token = header.slice("Bearer ".length);
    const { payload } = await import_jose.jwtVerify(token, jwks);
    const sub = payload.sub;
    if (!sub) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid token subject" });
    }
    const supabaseUser = {
      id: sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      user_metadata: payload.user_metadata ?? {},
      app_metadata: payload.app_metadata ?? {}
    };
    req.supabaseUser = supabaseUser;
    req.user = await upsertUserFromSupabase(supabaseUser);
    next();
  } catch (error) {
    console.error("[auth] Token verification failed:", error);
    return res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
  }
}

// src/middleware/credits.ts
function requireCredits(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  if (user.creditsUsed >= user.creditLimit) {
    return res.status(402).json({
      error: "credits_exhausted",
      creditsUsed: user.creditsUsed,
      creditLimit: user.creditLimit,
      plan: user.plan
    });
  }
  next();
}

// src/agent/prompt-loader.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_url2 = require("node:url");
var __dirname2 = import_node_path.dirname(import_node_url2.fileURLToPath(import.meta.url));
var AGENT_INSTRUCTIONS = `
## Agent Instructions

You have a \`web_search\` tool. Call it when you need current facts, news, or information you do not already have from the conversation.

For follow-up questions, use the prior conversation messages first. Only call \`web_search\` if you need new external information that is not already in the thread.

When search results are returned by the tool, cite them as [1], [2], etc. Numbering starts at 1 across results.

After your final answer (not during tool use), append:

\`\`\`
<FOLLOWUP_QUESTIONS>
- question 1
- question 2
</FOLLOWUP_QUESTIONS>
\`\`\`

Do not wrap your main answer in XML tags other than FOLLOWUP_QUESTIONS.
Write the answer as markdown following the format rules above — use \`##\` headings with blank lines before and after each heading.
`.trim();
var cachedPromptTemplate = null;
function resolvePromptPath() {
  const candidates = [
    import_node_path.join(__dirname2, "prompts", "prompt.md"),
    import_node_path.join(__dirname2, "..", "prompts", "prompt.md"),
    import_node_path.join(__dirname2, "..", "..", "prompts", "prompt.md")
  ];
  for (const candidate of candidates) {
    if (import_node_fs.existsSync(candidate))
      return candidate;
  }
  throw new Error("prompt.md not found");
}
function loadPromptTemplate() {
  if (cachedPromptTemplate)
    return cachedPromptTemplate;
  cachedPromptTemplate = import_node_fs.readFileSync(resolvePromptPath(), "utf8");
  return cachedPromptTemplate;
}
function getSystemPrompt() {
  let prompt = loadPromptTemplate();
  prompt = prompt.replaceAll("{{CURRENT_DATE}}", new Date().toUTCString());
  prompt += `

${AGENT_INSTRUCTIONS}`;
  return prompt;
}
function extractFollowUps(text) {
  const match = text.match(/<FOLLOWUP_QUESTIONS>([\s\S]*?)<\/FOLLOWUP_QUESTIONS>/i);
  if (!match) {
    return { answer: text.trim(), followUps: [] };
  }
  const block = match[1] ?? "";
  const followUps = block.split(`
`).map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim()).filter(Boolean);
  const answer = text.replace(match[0], "").trim();
  return { answer, followUps };
}
var SYSTEM_PROMPT = getSystemPrompt();
// src/ask/ask-utils.ts
var ALLOWED_MODELS = {
  best: "openai/gpt-4.1-mini",
  sonar: "openai/gpt-4.1-mini",
  "gpt-5": "openai/gpt-4o",
  gemini: "google/gemini-2.5-flash"
};
function getSearchDepth(searchMode) {
  return searchMode === "research" ? "advanced" : "basic";
}
function writeEvent(res, payload) {
  res.write(`${JSON.stringify(payload)}
`);
}

// src/agent/agent-loop.ts
var import_pi_ai2 = require("@earendil-works/pi-ai");

// src/agent/stream-fn.ts
var import_pi_ai = require("@earendil-works/pi-ai");
var import_openrouter = require("@earendil-works/pi-ai/providers/openrouter");
var models = import_pi_ai.createModels();
models.setProvider(import_openrouter.openrouterProvider());
var defaultStreamFn = (model, context, options) => models.streamSimple(model, context, {
  ...options,
  apiKey: options?.apiKey ?? process.env.OPENROUTER_API_KEY
});
function getDefaultStreamFn() {
  if (!defaultStreamFn) {
    throw new Error("No default stream function configured. Pass streamFn explicitly or call setDefaultStreamFn().");
  }
  return defaultStreamFn;
}

// src/agent/agent-loop.ts
function agentLoop(prompts, context, config2, signal, streamFn) {
  const stream = createAgentStream();
  runAgentLoop(prompts, context, config2, async (event) => {
    stream.push(event);
  }, signal, streamFn).then((messages) => {
    stream.end(messages);
  });
  return stream;
}
async function runAgentLoop(prompts, context, config2, emit, signal, streamFn) {
  const newMessages = [...prompts];
  const currentContext = {
    ...context,
    messages: [...context.messages, ...prompts]
  };
  await emit({ type: "agent_start" });
  await emit({ type: "turn_start" });
  for (const prompt of prompts) {
    await emit({ type: "message_start", message: prompt });
    await emit({ type: "message_end", message: prompt });
  }
  await runLoop(currentContext, newMessages, config2, signal, emit, streamFn ?? getDefaultStreamFn());
  return newMessages;
}
function createAgentStream() {
  return new import_pi_ai2.EventStream((event) => event.type === "agent_end", (event) => event.type === "agent_end" ? event.messages : []);
}
async function runLoop(initialContext, newMessages, initialConfig, signal, emit, streamFunction) {
  let currentContext = initialContext;
  let config2 = initialConfig;
  let firstTurn = true;
  let pendingMessages = await config2.getSteeringMessages?.() || [];
  while (true) {
    let hasMoreToolCalls = true;
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      if (!firstTurn) {
        await emit({ type: "turn_start" });
      } else {
        firstTurn = false;
      }
      if (pendingMessages.length > 0) {
        for (const message2 of pendingMessages) {
          await emit({ type: "message_start", message: message2 });
          await emit({ type: "message_end", message: message2 });
          currentContext.messages.push(message2);
          newMessages.push(message2);
        }
        pendingMessages = [];
      }
      const message = await streamAssistantResponse(currentContext, config2, signal, emit, streamFunction);
      newMessages.push(message);
      if (message.stopReason === "error" || message.stopReason === "aborted") {
        await emit({ type: "turn_end", message, toolResults: [] });
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      const toolResults = [];
      hasMoreToolCalls = false;
      if (toolCalls.length > 0) {
        const executedToolBatch = message.stopReason === "length" ? await failToolCallsFromTruncatedMessage(toolCalls, emit) : await executeToolCalls(currentContext, message, config2, signal, emit);
        toolResults.push(...executedToolBatch.messages);
        hasMoreToolCalls = !executedToolBatch.terminate;
        for (const result of toolResults) {
          currentContext.messages.push(result);
          newMessages.push(result);
        }
      }
      await emit({ type: "turn_end", message, toolResults });
      const nextTurnContext = {
        message,
        toolResults,
        context: currentContext,
        newMessages
      };
      const nextTurnSnapshot = await config2.prepareNextTurn?.(nextTurnContext);
      if (nextTurnSnapshot) {
        currentContext = nextTurnSnapshot.context ?? currentContext;
        config2 = {
          ...config2,
          model: nextTurnSnapshot.model ?? config2.model,
          reasoning: nextTurnSnapshot.thinkingLevel === undefined ? config2.reasoning : nextTurnSnapshot.thinkingLevel === "off" ? undefined : nextTurnSnapshot.thinkingLevel
        };
      }
      if (await config2.shouldStopAfterTurn?.({
        message,
        toolResults,
        context: currentContext,
        newMessages
      })) {
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }
      pendingMessages = await config2.getSteeringMessages?.() || [];
    }
    const followUpMessages = await config2.getFollowUpMessages?.() || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;
    }
    break;
  }
  await emit({ type: "agent_end", messages: newMessages });
}
async function streamAssistantResponse(context, config2, signal, emit, streamFunction) {
  let messages = context.messages;
  if (config2.transformContext) {
    messages = await config2.transformContext(messages, signal);
  }
  const llmMessages = await config2.convertToLlm(messages);
  const llmContext = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools
  };
  const resolvedApiKey = (config2.getApiKey ? await config2.getApiKey(config2.model.provider) : undefined) || config2.apiKey;
  const response = await streamFunction(config2.model, llmContext, {
    ...config2,
    apiKey: resolvedApiKey,
    signal
  });
  let partialMessage = null;
  let addedPartial = false;
  for await (const event of response) {
    switch (event.type) {
      case "start":
        partialMessage = event.partial;
        context.messages.push(partialMessage);
        addedPartial = true;
        await emit({ type: "message_start", message: { ...partialMessage } });
        break;
      case "text_start":
      case "text_delta":
      case "text_end":
      case "thinking_start":
      case "thinking_delta":
      case "thinking_end":
      case "toolcall_start":
      case "toolcall_delta":
      case "toolcall_end":
        if (partialMessage) {
          partialMessage = event.partial;
          context.messages[context.messages.length - 1] = partialMessage;
          await emit({
            type: "message_update",
            assistantMessageEvent: event,
            message: { ...partialMessage }
          });
        }
        break;
      case "done":
      case "error": {
        const finalMessage2 = await response.result();
        if (addedPartial) {
          context.messages[context.messages.length - 1] = finalMessage2;
        } else {
          context.messages.push(finalMessage2);
        }
        if (!addedPartial) {
          await emit({ type: "message_start", message: { ...finalMessage2 } });
        }
        await emit({ type: "message_end", message: finalMessage2 });
        return finalMessage2;
      }
    }
  }
  const finalMessage = await response.result();
  if (addedPartial) {
    context.messages[context.messages.length - 1] = finalMessage;
  } else {
    context.messages.push(finalMessage);
    await emit({ type: "message_start", message: { ...finalMessage } });
  }
  await emit({ type: "message_end", message: finalMessage });
  return finalMessage;
}
async function failToolCallsFromTruncatedMessage(toolCalls, emit) {
  const messages = [];
  for (const toolCall of toolCalls) {
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments
    });
    const finalized = {
      toolCall,
      result: createErrorToolResult(`Tool call "${toolCall.name}" was not executed: the response hit the output token limit, so its arguments may be truncated. Re-issue the tool call with complete arguments.`),
      isError: true
    };
    await emitToolExecutionEnd(finalized, emit);
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return { messages, terminate: false };
}
async function executeToolCalls(currentContext, assistantMessage, config2, signal, emit) {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  const hasSequentialToolCall = toolCalls.some((tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === "sequential");
  if (config2.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config2, signal, emit);
  }
  return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config2, signal, emit);
}
async function executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config2, signal, emit) {
  const finalizedCalls = [];
  const messages = [];
  for (const toolCall of toolCalls) {
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments
    });
    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config2, signal);
    let finalized;
    if (preparation.kind === "immediate") {
      finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError
      };
    } else {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config2, signal);
    }
    await emitToolExecutionEnd(finalized, emit);
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    finalizedCalls.push(finalized);
    messages.push(toolResultMessage);
    if (signal?.aborted) {
      break;
    }
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(finalizedCalls)
  };
}
async function executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config2, signal, emit) {
  const finalizedCalls = [];
  for (const toolCall of toolCalls) {
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments
    });
    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config2, signal);
    if (preparation.kind === "immediate") {
      const finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError
      };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      if (signal?.aborted) {
        break;
      }
      continue;
    }
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      const finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config2, signal);
      await emitToolExecutionEnd(finalized, emit);
      return finalized;
    });
    if (signal?.aborted) {
      break;
    }
  }
  const orderedFinalizedCalls = await Promise.all(finalizedCalls.map((entry) => typeof entry === "function" ? entry() : Promise.resolve(entry)));
  const messages = [];
  for (const finalized of orderedFinalizedCalls) {
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(orderedFinalizedCalls)
  };
}
function shouldTerminateToolBatch(finalizedCalls) {
  return finalizedCalls.length > 0 && finalizedCalls.every((finalized) => finalized.result.terminate === true);
}
function prepareToolCallArguments(tool, toolCall) {
  if (!tool.prepareArguments) {
    return toolCall;
  }
  const preparedArguments = tool.prepareArguments(toolCall.arguments);
  if (preparedArguments === toolCall.arguments) {
    return toolCall;
  }
  return {
    ...toolCall,
    arguments: preparedArguments
  };
}
async function prepareToolCall(currentContext, assistantMessage, toolCall, config2, signal) {
  const tool = currentContext.tools?.find((t) => t.name === toolCall.name);
  if (!tool) {
    return {
      kind: "immediate",
      result: createErrorToolResult(`Tool ${toolCall.name} not found`),
      isError: true
    };
  }
  try {
    const preparedToolCall = prepareToolCallArguments(tool, toolCall);
    const validatedArgs = import_pi_ai2.validateToolArguments(tool, preparedToolCall);
    if (config2.beforeToolCall) {
      const beforeResult = await config2.beforeToolCall({
        assistantMessage,
        toolCall,
        args: validatedArgs,
        context: currentContext
      }, signal);
      if (signal?.aborted) {
        return {
          kind: "immediate",
          result: createErrorToolResult("Operation aborted"),
          isError: true
        };
      }
      if (beforeResult?.block) {
        return {
          kind: "immediate",
          result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
          isError: true
        };
      }
    }
    if (signal?.aborted) {
      return {
        kind: "immediate",
        result: createErrorToolResult("Operation aborted"),
        isError: true
      };
    }
    return {
      kind: "prepared",
      toolCall,
      tool,
      args: validatedArgs
    };
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true
    };
  }
}
async function executePreparedToolCall(prepared, signal, emit) {
  const updateEvents = [];
  let acceptingUpdates = true;
  try {
    const result = await prepared.tool.execute(prepared.toolCall.id, prepared.args, signal, (partialResult) => {
      if (!acceptingUpdates)
        return;
      updateEvents.push(Promise.resolve(emit({
        type: "tool_execution_update",
        toolCallId: prepared.toolCall.id,
        toolName: prepared.toolCall.name,
        args: prepared.toolCall.arguments,
        partialResult
      })));
    });
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return { result, isError: false };
  } catch (error) {
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return {
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true
    };
  } finally {
    acceptingUpdates = false;
  }
}
async function finalizeExecutedToolCall(currentContext, assistantMessage, prepared, executed, config2, signal) {
  let result = executed.result;
  let isError = executed.isError;
  if (config2.afterToolCall) {
    try {
      const afterResult = await config2.afterToolCall({
        assistantMessage,
        toolCall: prepared.toolCall,
        args: prepared.args,
        result,
        isError,
        context: currentContext
      }, signal);
      if (afterResult) {
        result = {
          ...result,
          content: afterResult.content ?? result.content,
          details: afterResult.details ?? result.details,
          usage: afterResult.usage ?? result.usage,
          terminate: afterResult.terminate ?? result.terminate
        };
        isError = afterResult.isError ?? isError;
      }
    } catch (error) {
      result = createErrorToolResult(error instanceof Error ? error.message : String(error));
      isError = true;
    }
  }
  return {
    toolCall: prepared.toolCall,
    result,
    isError
  };
}
function createErrorToolResult(message) {
  return {
    content: [{ type: "text", text: message }],
    details: {}
  };
}
async function emitToolExecutionEnd(finalized, emit) {
  await emit({
    type: "tool_execution_end",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    result: finalized.result,
    isError: finalized.isError
  });
}
function createToolResultMessage(finalized) {
  return {
    role: "toolResult",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    content: finalized.result.content ?? [],
    details: finalized.result.details,
    usage: finalized.result.usage,
    ...finalized.result.addedToolNames?.length ? { addedToolNames: finalized.result.addedToolNames } : {},
    isError: finalized.isError,
    timestamp: Date.now()
  };
}
async function emitToolResultMessage(toolResultMessage, emit) {
  await emit({ type: "message_start", message: toolResultMessage });
  await emit({ type: "message_end", message: toolResultMessage });
}

// src/agent/models.ts
var AGENT_MODEL_MAP = {
  ...ALLOWED_MODELS,
  best: "openai/gpt-4.1-mini",
  sonar: "openai/gpt-4.1-mini",
  claude: "anthropic/claude-sonnet-4",
  "gpt-5": "openai/gpt-4o",
  gemini: "google/gemini-2.5-flash"
};
var DEFAULT_MODEL_ID = AGENT_MODEL_MAP.best;
function getAgentModel(modelId) {
  const openRouterId = AGENT_MODEL_MAP[modelId ?? ""] ?? DEFAULT_MODEL_ID;
  const model = models.getModel("openrouter", openRouterId);
  if (model)
    return model;
  const fallback = models.getModel("openrouter", DEFAULT_MODEL_ID);
  if (fallback)
    return fallback;
  const available = models.getModels("openrouter");
  if (available.length === 0) {
    throw new Error("No OpenRouter models available");
  }
  return available[0];
}

// src/tools/web-search.ts
var import_pi_ai3 = require("@earendil-works/pi-ai");

// src/search/search.ts
var import_core = require("@tavily/core");
var client = import_core.tavily({ apiKey: process.env.TAVILY_API_KEY || "" });
async function webSearch(query, searchDepth = "advanced") {
  const result = await client.search(query, { searchDepth });
  return (result.results ?? []).map((r) => ({
    title: r.title ?? r.url,
    url: r.url,
    content: r.content ?? ""
  }));
}

// src/tools/web-search.ts
var parameters = import_pi_ai3.Type.Object({
  query: import_pi_ai3.Type.String({ description: "The search query to look up on the web" }),
  searchDepth: import_pi_ai3.Type.Optional(import_pi_ai3.Type.Union([import_pi_ai3.Type.Literal("basic"), import_pi_ai3.Type.Literal("advanced")], {
    description: "basic for quick answers, advanced for deeper research"
  }))
});
function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
function createWebSearchTool(defaultDepth = "basic", registerResult) {
  return {
    name: "web_search",
    label: "Web Search",
    description: "Search the web for current information. Returns numbered results with title, url, and content snippets for citation.",
    parameters,
    async execute(_toolCallId, params) {
      const depth = params.searchDepth ?? defaultDepth;
      const results = await webSearch(params.query, depth);
      const numbered = results.map((r) => {
        const registered = registerResult?.(r);
        const index = registered?.index ?? 0;
        const title = registered?.title ?? r.title;
        const url = registered?.url ?? r.url;
        return `[${index}] ${title}
URL: ${url}
${r.content}`;
      }).join(`

`);
      const text = results.length === 0 ? "No search results found." : `Search results for "${params.query}":

${numbered}`;
      return {
        content: [{ type: "text", text }],
        details: { results }
      };
    }
  };
}

// src/agent/agent-runner.ts
var MAX_HISTORY_MESSAGES = 20;
function isLlmMessage(message) {
  return typeof message === "object" && message !== null && "role" in message && (message.role === "user" || message.role === "assistant" || message.role === "toolResult");
}
function getAssistantText(message) {
  return message.content.filter((c) => c.type === "text").map((c) => c.text).join("");
}
function createAnswerDeltaStreamer(onDelta) {
  let buffer = "";
  let suppressed = false;
  const marker = "<FOLLOWUP_QUESTIONS>";
  return {
    push(delta) {
      if (suppressed)
        return;
      buffer += delta;
      const idx = buffer.toUpperCase().indexOf(marker);
      if (idx !== -1) {
        const safe = buffer.slice(0, idx);
        if (safe)
          onDelta(safe);
        suppressed = true;
        buffer = "";
        return;
      }
      const maxPartial = marker.length - 1;
      if (buffer.length > maxPartial) {
        const emit = buffer.slice(0, buffer.length - maxPartial);
        buffer = buffer.slice(buffer.length - maxPartial);
        if (emit)
          onDelta(emit);
      }
    },
    flush() {
      if (!suppressed && buffer) {
        onDelta(buffer);
        buffer = "";
      }
    }
  };
}
function createSourceRegistry() {
  const sourcesByUrl = new Map;
  function registerResult(result) {
    const existing = sourcesByUrl.get(result.url);
    if (existing)
      return existing;
    const item = {
      index: sourcesByUrl.size + 1,
      title: result.title ?? result.url,
      url: result.url,
      domain: domainFromUrl(result.url)
    };
    sourcesByUrl.set(result.url, item);
    return item;
  }
  return {
    registerResult,
    list: () => [...sourcesByUrl.values()].sort((a, b) => a.index - b.index)
  };
}
async function runAgentQuery(options) {
  const searchDepth = getSearchDepth(options.searchMode);
  const model = getAgentModel(options.model);
  const registry = createSourceRegistry();
  const webSearchTool = createWebSearchTool(searchDepth, registry.registerResult);
  const context = {
    systemPrompt: getSystemPrompt(),
    messages: [...options.history ?? []],
    tools: [webSearchTool]
  };
  const userMessage = {
    role: "user",
    content: options.query,
    timestamp: Date.now()
  };
  const config2 = {
    model,
    apiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0.2,
    convertToLlm: (messages) => messages.filter(isLlmMessage),
    shouldStopAfterTurn: ({ message }) => message.stopReason === "stop" || message.stopReason === "length"
  };
  let finalAnswerText = "";
  let deltaStreamer = createAnswerDeltaStreamer((text) => {
    options.onEvent({ type: "delta", text });
  });
  const stream = agentLoop([userMessage], context, config2, options.signal, getDefaultStreamFn());
  for await (const event of stream) {
    switch (event.type) {
      case "turn_start": {
        deltaStreamer.flush();
        deltaStreamer = createAnswerDeltaStreamer((text) => {
          options.onEvent({ type: "delta", text });
        });
        break;
      }
      case "message_update": {
        const ame = event.assistantMessageEvent;
        if (ame.type === "text_delta") {
          deltaStreamer.push(ame.delta);
        } else if (ame.type === "thinking_delta") {
          options.onEvent({ type: "thinking", text: ame.delta });
        }
        break;
      }
      case "message_end": {
        deltaStreamer.flush();
        if (event.message.role === "assistant") {
          const text = getAssistantText(event.message);
          if (text.trim() && event.message.stopReason !== "toolUse") {
            finalAnswerText = text;
          } else if (text.trim() && !finalAnswerText) {
            finalAnswerText = text;
          }
        }
        break;
      }
      case "tool_execution_start": {
        options.onEvent({
          type: "tool_start",
          name: event.toolName,
          args: event.args
        });
        if (event.toolName === "web_search") {
          options.onEvent({ type: "status", message: "Searching the web..." });
        }
        break;
      }
      case "tool_execution_end": {
        options.onEvent({ type: "tool_end", name: event.toolName });
        if (event.toolName === "web_search" && !event.isError) {
          const sources2 = registry.list();
          if (sources2.length > 0) {
            options.onEvent({ type: "sources", items: sources2 });
          }
        }
        break;
      }
      case "agent_end": {
        for (let i = event.messages.length - 1;i >= 0; i--) {
          const msg = event.messages[i];
          if (msg && typeof msg === "object" && "role" in msg && msg.role === "assistant") {
            const assistant = msg;
            if (assistant.stopReason === "toolUse")
              continue;
            const text = getAssistantText(assistant);
            if (text.trim()) {
              finalAnswerText = text;
              break;
            }
          }
        }
        break;
      }
      default:
        break;
    }
  }
  const { answer, followUps } = extractFollowUps(finalAnswerText || "");
  const sources = registry.list();
  if (sources.length > 0) {
    options.onEvent({ type: "sources", items: sources });
  }
  if (followUps.length > 0) {
    options.onEvent({ type: "followups", items: followUps });
  }
  return { answer, followUps, sources };
}
function historyFromDbMessages(messages) {
  const recent = messages.slice(-MAX_HISTORY_MESSAGES);
  return recent.map((m) => {
    const content = m.content.replace(/\n*\n?<!--SOURCES:[\s\S]*?-->\s*$/, "").trimEnd();
    if (m.role === "User") {
      return {
        role: "user",
        content,
        timestamp: Date.now()
      };
    }
    return {
      role: "assistant",
      content: [{ type: "text", text: content }],
      api: "openai-completions",
      provider: "openrouter",
      model: "history",
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: "stop",
      timestamp: Date.now()
    };
  });
}

// src/routes/conversations.ts
var import_express = require("express");

// src/db/slug.ts
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "thread";
}

// src/routes/conversations.ts
var conversationsRouter = import_express.Router();
conversationsRouter.get("/", requireAuth, async (req, res) => {
  const conversations = await prisma.conversation.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true }
      }
    }
  });
  res.json({ conversations });
});
conversationsRouter.post("/", requireAuth, async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title : "New thread";
  const conversation = await prisma.conversation.create({
    data: {
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      userId: req.user.id
    }
  });
  res.status(201).json({ conversation });
});
conversationsRouter.get("/:id", requireAuth, async (req, res) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!conversation) {
    return res.status(404).json({ error: "not_found" });
  }
  res.json({ conversation });
});
conversationsRouter.delete("/:id", requireAuth, async (req, res) => {
  const existing = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!existing) {
    return res.status(404).json({ error: "not_found" });
  }
  await prisma.conversation.delete({ where: { id: existing.id } });
  res.status(204).end();
});
async function getOrCreateConversation(userId, conversationId, query) {
  if (conversationId) {
    const existing = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });
    if (existing)
      return existing;
  }
  const title = query.slice(0, 80);
  return prisma.conversation.create({
    data: {
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      userId
    }
  });
}

// src/routes/ask.ts
var askRouter = import_express2.Router();
askRouter.post("/", requireAuth, requireCredits, async (req, res) => {
  const abortController = new AbortController;
  const onClose = () => abortController.abort();
  req.on("close", onClose);
  try {
    const { query, model, conversationId, searchMode } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid query" });
    }
    const user = req.user;
    const conversation = await getOrCreateConversation(user.id, conversationId, query);
    const priorMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true }
    });
    await prisma.message.create({
      data: {
        content: query,
        role: "User",
        conversationId: conversation.id
      }
    });
    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    const result = await runAgentQuery({
      query,
      model,
      searchMode,
      history: historyFromDbMessages(priorMessages),
      signal: abortController.signal,
      onEvent: (event) => {
        if (!res.writableEnded) {
          writeEvent(res, event);
        }
      }
    });
    const sourcesMarker = result.sources.length > 0 ? `

<!--SOURCES:${JSON.stringify(result.sources)}-->` : "";
    await prisma.$transaction([
      prisma.message.create({
        data: {
          content: `${result.answer}${sourcesMarker}`,
          role: "Assistant",
          conversationId: conversation.id
        }
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          title: conversation.title || query.slice(0, 80),
          updatedAt: new Date
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { creditsUsed: { increment: 1 } }
      }),
      prisma.creditUsage.create({
        data: { userId: user.id, action: "ask" }
      })
    ]);
    writeEvent(res, {
      type: "done",
      conversationId: conversation.id,
      creditsUsed: user.creditsUsed + 1,
      creditLimit: user.creditLimit
    });
    res.end();
  } catch (error) {
    console.error("[/ask] Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
    writeEvent(res, {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
    res.end();
  } finally {
    req.off("close", onClose);
  }
});

// src/routes/user.ts
var import_express3 = require("express");
var userRouter = import_express3.Router();
userRouter.get("/", requireAuth, (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    creditsUsed: user.creditsUsed,
    creditLimit: user.creditLimit,
    creditsRemaining: Math.max(0, user.creditLimit - user.creditsUsed)
  });
});

// src/app.ts
function getAllowedOrigins() {
  const configured = process.env.FRONTEND_URL ?? "http://localhost:5173";
  return configured.split(",").map((origin) => origin.trim()).filter(Boolean);
}
function isAllowedOrigin(origin) {
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin))
    return true;
  try {
    const hostname = new URL(origin).hostname;
    if (hostname.endsWith(".vercel.app"))
      return true;
  } catch {
    return false;
  }
  return false;
}
function createApp() {
  const app = import_express4.default();
  app.use(import_cors.default({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  }));
  app.use(import_express4.default.json());
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/ask", askRouter);
  app.use("/conversations", conversationsRouter);
  app.use("/me", userRouter);
  return app;
}

// vercel-entry.ts
var app = createApp();
var vercel_entry_default = app;
