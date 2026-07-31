import { Loader2, Search } from "lucide-react";
import { SourcePanel } from "@/components/sources/source-panel";
import type { SourceItem } from "@/lib/sources";

type AgentStatusProps = {
  status: string | null;
  toolName?: string | null;
  sources?: SourceItem[];
};

export function AgentStatus({ status, toolName, sources = [] }: AgentStatusProps) {
  const searching = toolName === "web_search" || status === "Searching the web...";

  if (searching) {
    return (
      <div className="mx-auto mb-3 w-full max-w-(--thread-max-width) px-4">
        <SourcePanel sources={sources} searching={sources.length === 0} />
      </div>
    );
  }

  const label = status ?? (toolName ? `Running ${toolName}...` : null);
  if (!label) return null;

  return (
    <div className="mx-auto mb-3 flex w-full max-w-(--thread-max-width) items-center gap-2 px-4 text-sm text-[#6f675d] dark:text-[#a39c93]">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#e0d8cb] bg-[#f5f1eb] px-3 py-1.5 dark:border-[#3a342f] dark:bg-[#2a2724]">
        <Loader2 className="size-3.5 animate-spin text-accent" />
        {toolName ? <Search className="size-3.5 text-accent" /> : null}
        <span>{label}</span>
      </span>
    </div>
  );
}
