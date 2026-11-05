import "server-only";

import { tavily } from "@tavily/core";
import { tool } from "ai";
import { z } from "zod";

import { serverEnvironment } from "@/data/server.environment";

const tavilyClient = tavily({ apiKey: serverEnvironment.TAVILY_API_KEY });

export const webSearchTool = tool({
  description:
    "Search the web for current information. Returns the most relevant pages with their content.",
  inputSchema: z.object({
    query: z.string().min(1).describe("The search query"),
    maxResults: z.number().int().min(1).max(10).default(5),
  }),
  execute: async ({ query, maxResults }) => {
    const { results } = await tavilyClient.search(query, { maxResults });

    return results.map(({ title, url, content, publishedDate }) => ({
      title,
      url,
      content,
      publishedDate,
    }));
  },
});
