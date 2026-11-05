import { Chat } from "@/components/ui/ai/chat";
import {
  agentChatDescription,
  agentChatSuggestions,
} from "@/features/agent/data/agent-chat.data";

export function AgentChat() {
  return (
    <Chat
      description={agentChatDescription}
      suggestions={agentChatSuggestions}
    />
  );
}
