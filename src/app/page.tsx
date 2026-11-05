import { Chat } from "@/components/ui/ai/chat"

export default function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-3xl flex-col">
      <Chat
        description="Ask the agent to change your code."
        suggestions={[
          "Explain this codebase",
          "Fix the failing build",
          "Write tests for the form",
          "Find unused dependencies",
        ]}
      />
    </main>
  )
}
