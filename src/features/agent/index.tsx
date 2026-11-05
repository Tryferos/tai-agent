import { AgentChat } from "@/features/agent/components/agent-chat";

export function Agent() {
  return (
    <main className="mx-auto flex h-[calc(100dvh-32px)] rounded-md w-full max-w-3xl flex-col bg-card">
      <AgentChat />
    </main>
  );
}
