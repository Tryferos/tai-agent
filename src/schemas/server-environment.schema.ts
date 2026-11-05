import { z } from "zod";

export const serverEnvironmentSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  TAVILY_API_KEY: z.string().min(1),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
