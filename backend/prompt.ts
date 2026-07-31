/**
 * @deprecated Prefer getSystemPrompt() from lib/prompt-loader.ts
 */
export { getSystemPrompt, SYSTEM_PROMPT, extractFollowUps } from "./lib/prompt-loader.ts";

export const PROMPT_TEMPLATE = `
## Web search results
{{WEB_SEARCH_RESULTS}}

## User query
{{USER_QUERY}}
`;
