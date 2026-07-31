import type { SourceItem } from "@/lib/sources";
import { cn } from "@/lib/utils";

type SourceCardProps = {
  source: SourceItem;
  compact?: boolean;
  className?: string;
};

export function faviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

export function SourceCard({ source, compact = false, className }: SourceCardProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.title}
      className={cn(
        "group flex min-w-0 items-start gap-2 rounded-xl border border-accent-border bg-[#f5f1eb] transition-colors hover:border-accent hover:bg-accent-muted dark:border-accent-border dark:bg-[#2a2724] dark:hover:border-accent dark:hover:bg-accent-muted",
        compact ? "max-w-[200px] px-2.5 py-1.5" : "max-w-[240px] px-3 py-2",
        className,
      )}
    >
      <img
        src={faviconUrl(source.domain)}
        alt=""
        width={16}
        height={16}
        className="mt-0.5 size-4 shrink-0 rounded-sm"
        loading="lazy"
      />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate font-medium text-[#2c2721] dark:text-[#ece7df]",
            compact ? "text-xs" : "text-[13px] leading-snug",
          )}
        >
          {source.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-[#8a8176] dark:text-[#9d968d]">
          {source.domain}
        </span>
      </span>
    </a>
  );
}
