import { z } from "zod";

// Only NEXT_PUBLIC_* variables belong here: Next.js inlines them into the client bundle.
export const clientEnvironmentSchema = z.object({});

export type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;
