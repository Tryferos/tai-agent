import { createAgentUIStreamResponse } from "ai";
import { z } from "zod";

import { chatAgent } from "@ai/agents/chat.agent";

const chatRequestSchema = z.object({
  messages: z.array(z.unknown()),
});

export async function POST(request: Request) {
  const { messages } = chatRequestSchema.parse(await request.json());

  return createAgentUIStreamResponse({
    agent: chatAgent,
    uiMessages: messages,
    abortSignal: request.signal,
  });
}
