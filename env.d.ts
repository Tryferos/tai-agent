import type { ClientEnvironment } from "@schemas/client-environment.schema";
import type { ServerEnvironment } from "@schemas/server-environment.schema";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ServerEnvironment, ClientEnvironment {}
  }
}

export {};
