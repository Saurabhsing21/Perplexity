import { createModels } from "@earendil-works/pi-ai";
import { openrouterProvider } from "@earendil-works/pi-ai/providers/openrouter";
import type { StreamFn } from "./types.ts";

const models = createModels();
models.setProvider(openrouterProvider());

let defaultStreamFn: StreamFn | undefined = (model, context, options) =>
  models.streamSimple(model, context, {
    ...options,
    apiKey: options?.apiKey ?? process.env.OPENROUTER_API_KEY,
  });

/**
 * Configure the fallback used by Agent and low-level loops when callers omit streamFn.
 */
export function setDefaultStreamFn(streamFn: StreamFn | undefined): void {
  defaultStreamFn = streamFn;
}

export function getDefaultStreamFn(): StreamFn {
  if (!defaultStreamFn) {
    throw new Error(
      "No default stream function configured. Pass streamFn explicitly or call setDefaultStreamFn().",
    );
  }
  return defaultStreamFn;
}

export { models };
