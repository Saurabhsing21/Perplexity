import type { SourceItem } from "@/lib/sources";
import { SourceCard } from "./source-card";
import { SourcesSummary } from "./sources-summary";
import { cn } from "@/lib/utils";

type SourcePanelProps = {
  sources: SourceItem[];
  searching?: boolean;
  className?: string;
  maxVisible?: number;
};

export function SourcePanel({
  sources,
  searching = false,
  className,
  maxVisible = 6,
}: SourcePanelProps) {
  if (sources.length === 0 && !searching) return null;

  const visible = sources.slice(0, maxVisible);

  return (
    <div className={cn("mb-4", className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#6f675d] dark:text-[#a39c93]">
          {searching ? "Searching the web" : sources.length > 0 ? "Sources" : null}
        </p>
        {sources.length > 0 ? <SourcesSummary count={sources.length} /> : null}
      </div>

      {visible.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visible.map((source) => (
            <SourceCard key={source.url} source={source} compact />
          ))}
        </div>
      ) : searching ? (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 w-40 animate-pulse rounded-xl border border-[#e0d8cb] bg-[#f5f1eb] dark:border-[#3a342f] dark:bg-[#2a2724]"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
