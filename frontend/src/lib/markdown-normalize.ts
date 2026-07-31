/**
 * Normalize assistant markdown so headings and paragraphs render with clear spacing.
 */
export function normalizeAnswerMarkdown(text: string): string {
  let result = text.replace(/\r\n/g, "\n");

  // Convert standalone **Title** lines into ## Title (section headings)
  result = result.replace(/^(?:\s*)\*\*([^*\n]+)\*\*\s*$/gm, (_match, title: string) => {
    const trimmed = title.trim();
    // Skip very short bold lines that are likely emphasis, not sections
    if (trimmed.length < 3) return `**${trimmed}**`;
    return `## ${trimmed}`;
  });

  // Ensure blank line before ATX headings (## / ###)
  result = result.replace(/([^\n])\n(#{1,6}\s+)/g, "$1\n\n$2");

  // Ensure blank line after ATX headings when the next line is content
  result = result.replace(/(^#{1,6}[^\n]*)\n([^\n#\s])/gm, "$1\n\n$2");

  // Heading that starts the string after some content without blank line (already covered),
  // but also fix "## Heading" stuck to previous paragraph mid-line
  result = result.replace(/([^\n#])(#{2,6}\s+)/g, "$1\n\n$2");

  // Collapse 3+ newlines to 2
  result = result.replace(/\n{3,}/g, "\n\n");

  // Trim trailing whitespace on each line
  result = result
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");

  return result.trim();
}
