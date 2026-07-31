export type SourceItem = {
  index: number;
  title: string;
  url: string;
  domain: string;
};

const SOURCES_MARKER_RE = /\n*\n?<!--SOURCES:([\s\S]*?)-->\s*$/;
const LEGACY_SOURCES_RE = /\n*\n?### Sources\n([\s\S]*)$/;

export function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function normalizeSourceItem(
  item: Partial<SourceItem> & { title: string; url: string },
  fallbackIndex: number,
): SourceItem {
  return {
    index: item.index ?? fallbackIndex,
    title: item.title,
    url: item.url,
    domain: item.domain ?? domainFromUrl(item.url),
  };
}

/** Embed sources in message content for persistence / reload. */
export function encodeSourcesMarker(sources: SourceItem[]): string {
  if (sources.length === 0) return "";
  return `\n\n<!--SOURCES:${JSON.stringify(sources)}-->`;
}

/** Strip and parse embedded sources (JSON marker or legacy ### Sources markdown). */
export function extractSourcesFromContent(content: string): {
  text: string;
  sources: SourceItem[];
} {
  const jsonMatch = content.match(SOURCES_MARKER_RE);
  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]) as Array<Partial<SourceItem> & { title: string; url: string }>;
      const sources = parsed.map((s, i) => normalizeSourceItem(s, i + 1));
      return {
        text: content.replace(SOURCES_MARKER_RE, "").trimEnd(),
        sources,
      };
    } catch {
      // fall through
    }
  }

  const legacyMatch = content.match(LEGACY_SOURCES_RE);
  if (legacyMatch?.[1]) {
    const links = [...legacyMatch[1].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m, i) =>
      normalizeSourceItem({ title: m[1]!, url: m[2]! }, i + 1),
    );
    return {
      text: content.replace(LEGACY_SOURCES_RE, "").trimEnd(),
      sources: links,
    };
  }

  return { text: content, sources: [] };
}

/** Convert citation indices like [1][2] into markdown links for CitationBadge. */
export function preprocessCitationLinks(text: string): string {
  return text.replace(/\[(\d+)\]/g, "[$1](citation:$1)");
}
