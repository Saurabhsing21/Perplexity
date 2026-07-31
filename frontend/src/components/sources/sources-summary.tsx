import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SourcesSummaryProps = {
  count: number;
  className?: string;
};

export function SourcesSummary({ count, className }: SourcesSummaryProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-accent-border bg-[#f5f1eb] px-2.5 py-1 text-xs font-medium text-[#3a342d] dark:border-accent-border dark:bg-[#2a2724] dark:text-[#e6dfd5]",
        className,
      )}
    >
      Sources
      <span className="text-accent">{count}</span>
      <ChevronRight className="size-3 opacity-60" />
    </span>
  );
}
