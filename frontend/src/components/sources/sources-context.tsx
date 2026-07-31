import { createContext, useContext } from "react";
import type { SourceItem } from "@/lib/sources";

export type SourcesContextValue = {
  /** Sources for the currently streaming answer */
  streamSources: SourceItem[];
  /** Lookup by citation index across available sources */
  getByIndex: (index: number) => SourceItem | undefined;
};

const SourcesContext = createContext<SourcesContextValue>({
  streamSources: [],
  getByIndex: () => undefined,
});

export const SourcesProvider = SourcesContext.Provider;

export function useSourcesContext() {
  return useContext(SourcesContext);
}

export function useSourceByIndex(index: number): SourceItem | undefined {
  const ctx = useSourcesContext();
  return ctx.getByIndex(index);
}
