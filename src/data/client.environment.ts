import { clientEnvironmentSchema } from "@/schemas/client-environment.schema";

// Each variable must be referenced as process.env.NEXT_PUBLIC_* so Next.js can inline it at build time.
export const clientEnvironment = clientEnvironmentSchema.parse({});
