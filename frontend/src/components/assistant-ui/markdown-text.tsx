"use client";

import type { ReactNode } from "react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { CitationLink } from "@/components/sources/citation-badge";
import { extractSourcesFromContent, preprocessCitationLinks } from "@/lib/sources";
import { normalizeAnswerMarkdown } from "@/lib/markdown-normalize";

function preprocessAnswer(text: string): string {
  const { text: cleaned } = extractSourcesFromContent(text);
  return preprocessCitationLinks(normalizeAnswerMarkdown(cleaned));
}

function H2({ children }: { children?: ReactNode }) {
  return (
    <h2 className="mt-8 mb-3 border-b border-accent-border pb-2 font-sans text-xl font-semibold tracking-tight text-[#2c2721] first:mt-4 dark:text-[#ece7df]">
      {children}
    </h2>
  );
}

function H3({ children }: { children?: ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 font-sans text-lg font-semibold text-[#2c2721] dark:text-[#ece7df]">
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  return <p className="my-3 leading-7 text-[#2c2721] dark:text-[#ece7df]">{children}</p>;
}

function UnorderedList({ children }: { children?: ReactNode }) {
  return <ul className="my-4 list-disc space-y-2 pl-5 marker:text-accent">{children}</ul>;
}

function OrderedList({ children }: { children?: ReactNode }) {
  return <ol className="my-4 list-decimal space-y-2 pl-5 marker:text-accent">{children}</ol>;
}

function ListItem({ children }: { children?: ReactNode }) {
  return <li className="leading-7">{children}</li>;
}

function Strong({ children }: { children?: ReactNode }) {
  return <strong className="font-semibold text-accent">{children}</strong>;
}

function Blockquote({ children }: { children?: ReactNode }) {
  return (
    <blockquote className="my-4 border-l-4 border-accent pl-4 text-[#5b534a] italic dark:text-[#a39c93]">
      {children}
    </blockquote>
  );
}

export const MarkdownText = () => (
  <MarkdownTextPrimitive
    remarkPlugins={[remarkGfm]}
    preprocess={preprocessAnswer}
    components={{
      h2: H2,
      h3: H3,
      p: Paragraph,
      ul: UnorderedList,
      ol: OrderedList,
      li: ListItem,
      strong: Strong,
      blockquote: Blockquote,
      a: ({ href, children }) => <CitationLink href={href}>{children}</CitationLink>,
    }}
  />
);
