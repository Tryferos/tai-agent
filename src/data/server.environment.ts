import "server-only";

import { serverEnvironmentSchema } from "@/schemas/server-environment.schema";

export const serverEnvironment = serverEnvironmentSchema.parse(process.env);
