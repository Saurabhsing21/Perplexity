import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGENT_INSTRUCTIONS = `
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

let cachedPromptTemplate: string | null = null;

function loadPromptTemplate(): string {
  if (cachedPromptTemplate) return cachedPromptTemplate;
  const path = join(__dirname, "..", "..", "prompts", "prompt.md");
  cachedPromptTemplate = readFileSync(path, "utf8");
  return cachedPromptTemplate;
}

/**
 * Build the static system prompt from prompt.md + agent tool instructions.
 * User query and conversation history belong in messages, not here.
 */
export function getSystemPrompt(): string {
  let prompt = loadPromptTemplate();
  prompt = prompt.replaceAll("{{CURRENT_DATE}}", new Date().toUTCString());
  prompt += `\n\n${AGENT_INSTRUCTIONS}`;
  return prompt;
}

/**
 * Extract follow-up questions from agent final text and return cleaned answer.
 */
export function extractFollowUps(text: string): {
  answer: string;
  followUps: string[];
} {
  const match = text.match(/<FOLLOWUP_QUESTIONS>([\s\S]*?)<\/FOLLOWUP_QUESTIONS>/i);
  if (!match) {
    return { answer: text.trim(), followUps: [] };
  }

  const block = match[1] ?? "";
  const followUps = block
    .split("\n")
    .map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim())
    .filter(Boolean);

  const answer = text.replace(match[0], "").trim();
  return { answer, followUps };
}

/** @deprecated Use getSystemPrompt() */
export const SYSTEM_PROMPT = getSystemPrompt();
