import "server-only";

import { type InferAgentUIMessage, ToolLoopAgent } from "ai";

import { openai } from "@/ai/providers/openai.provider";
import { webSearchTool } from "@/ai/tools/web-search.tool";

const chatAgentInstructions = [
  "You are a helpful assistant.",
  "Search the web when a question needs current or factual information.",
  "Cite the pages you used as inline markdown links.",
  "Format each citation like [Title](https://example.com).",
  "Put each citation after the sentence it supports, never inside it.",
  "Never use citation markers such as citeturn0search0.",
  "Write math in LaTeX wrapped in $$, inline like $$x^2$$.",
  "Put display equations on their own lines between $$ lines.",
  "Never use \\( \\), \\[ \\] or single $ as math delimiters.",
].join("\n");

export const chatAgent = new ToolLoopAgent({
  model: openai("gpt-6-luna"),
  instructions: chatAgentInstructions,
  tools: {
    webSearch: webSearchTool,
  },
});

export type ChatAgentUIMessage = InferAgentUIMessage<typeof chatAgent>;
