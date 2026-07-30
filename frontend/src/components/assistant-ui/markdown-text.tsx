"use client";

import { makeMarkdownText } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownText = makeMarkdownText({
  remarkPlugins: [remarkGfm],
});
