import type { ReactNode } from "react";
import { useMemo } from "react";
import { useSourceByIndex } from "./sources-context";
import { faviconUrl } from "./source-card";
import { cn } from "@/lib/utils";

type CitationBadgeProps = {
  index: number;
  extraCount?: number;
  className?: string;
};

export function CitationBadge({ index, extraCount = 0, className }: CitationBadgeProps) {
  const source = useSourceByIndex(index);

  const label = useMemo(() => {
    if (!source) return String(index);
    const short = source.domain.replace(/\.(com|org|net|io|ai|co|edu|gov)$/i, "");
    return short.length > 14 ? short.slice(0, 12) + "…" : short;
  }, [source, index]);

  if (!source) {
    return (
      <sup className="mx-0.5 text-[10px] font-medium text-[#8a8176] dark:text-[#9d968d]">
        [{index}]
      </sup>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.title}
      className={cn(
        "mx-0.5 inline-flex translate-y-[-1px] items-center gap-1 rounded-full border border-accent-border bg-[#f5f1eb] px-1.5 py-0.5 align-middle text-[11px] font-medium text-[#3a342d] no-underline transition-colors hover:border-accent hover:bg-accent-muted hover:text-accent dark:border-accent-border dark:bg-[#2a2724] dark:text-[#e6dfd5]",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={faviconUrl(source.domain)}
        alt=""
        width={12}
        height={12}
        className="size-3 rounded-sm"
        loading="lazy"
      />
      <span className="max-w-[7rem] truncate">{label}</span>
      {extraCount > 0 ? <span className="text-[#8a8176] dark:text-[#9d968d]">+{extraCount}</span> : null}
    </a>
  );
}

export function CitationLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (href?.startsWith("citation:")) {
    const index = Number(href.slice("citation:".length));
    if (Number.isFinite(index) && index > 0) {
      return <CitationBadge index={index} />;
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
    >
      {children}
    </a>
  );
}
