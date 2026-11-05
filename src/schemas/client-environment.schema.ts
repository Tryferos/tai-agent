import { z } from "zod";

export const clientEnvironmentSchema = z.object({});

export type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;
