import "server-only";

import { type InferAgentUIMessage, ToolLoopAgent } from "ai";

import { openai } from "@/ai/providers/openai.provider";
import { webSearchTool } from "@/ai/tools/web-search.tool";

export const chatAgent = new ToolLoopAgent({
  model: openai("gpt-6-luna"),
  instructions:
    "You are a helpful assistant. Search the web when a question needs current or factual information, and cite the pages you used.",
  tools: {
    webSearch: webSearchTool,
  },
});

export type ChatAgentUIMessage = InferAgentUIMessage<typeof chatAgent>;
