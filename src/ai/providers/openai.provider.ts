import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

import { serverEnvironment } from "@/data/server.environment";

export const openai = createOpenAI({ apiKey: serverEnvironment.OPENAI_API_KEY });
