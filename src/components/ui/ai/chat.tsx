"use client"

import * as React from "react"
import { useChat, type UseChatOptions } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  isToolUIPart,
  type SourceUrlUIPart,
  type UIMessage,
} from "ai"
import { MessageCircleDashedIcon, RotateCwIcon } from "lucide-react"
import { cn } from "cn"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trace } from "@/components/ui/trace"
import { InlineCitationLink } from "@/components/ui/ai/inline-citation"
import { Markdown } from "@/components/ui/ai/markdown"
import { PromptInput, type PromptInputMessage } from "@/components/ui/ai/prompt-input"
import { Reasoning } from "@/components/ui/ai/reasoning"
import { Sources } from "@/components/ui/ai/sources"
import { Suggestions } from "@/components/ui/ai/suggestions"
import { Tool } from "@/components/ui/ai/tool"

type Part = UIMessage["parts"][number]

const markdownComponents = { a: InlineCitationLink }

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

async function toFileParts(files: File[]) {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<{ type: "file"; mediaType: string; filename: string; url: string }>(
          (resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () =>
              resolve({
                type: "file",
                mediaType: file.type || "application/octet-stream",
                filename: file.name,
                url: reader.result as string,
              })
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          }
        )
    )
  )
}

function UserMessage({ message }: { message: UIMessage }) {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble align="end" variant="muted">
          <BubbleContent className="whitespace-pre-wrap">
            {getMessageText(message)}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function AssistantMessage({
  message,
  streaming,
}: {
  message: UIMessage
  streaming: boolean
}) {
  const groups: { kind: "trace" | "text"; parts: Part[] }[] = []
  const sources: SourceUrlUIPart[] = []

  for (const part of message.parts) {
    if (part.type === "source-url") {
      sources.push(part)
      continue
    }
    const kind =
      part.type === "reasoning" || isToolUIPart(part)
        ? "trace"
        : part.type === "text"
          ? "text"
          : null
    if (!kind) continue
    const last = groups.at(-1)
    if (last && last.kind === kind && kind === "trace") {
      last.parts.push(part)
    } else {
      groups.push({ kind, parts: [part] })
    }
  }

  const lastPart = message.parts.at(-1)

  return (
    <Message>
      <MessageContent className="gap-3">
        {groups.map((group, groupIndex) =>
          group.kind === "trace" ? (
            <Trace key={groupIndex}>
              {group.parts.map((part, index) => {
                if (part.type === "reasoning") {
                  return (
                    <Reasoning
                      key={index}
                      text={part.text}
                      running={streaming && part.state === "streaming"}
                    />
                  )
                }
                if (isToolUIPart(part)) {
                  return (
                    <Tool key={part.toolCallId} part={part} streaming={streaming} />
                  )
                }
                return null
              })}
            </Trace>
          ) : (
            group.parts.map((part, index) =>
              part.type === "text" ? (
                <Markdown
                  key={`${groupIndex}-${index}`}
                  components={markdownComponents}
                  streaming={streaming && part === lastPart}
                >
                  {part.text}
                </Markdown>
              ) : null
            )
          )
        )}
        {sources.length > 0 && <Sources sources={sources} />}
      </MessageContent>
    </Message>
  )
}

type ChatProps = {
  api?: string
  chatOptions?: UseChatOptions<UIMessage>
  title?: React.ReactNode
  description?: React.ReactNode
  placeholder?: string
  suggestions?: string[]
  emptyTitle?: React.ReactNode
  emptyDescription?: React.ReactNode
  className?: string
}

function Chat({
  api = "/api/chat",
  chatOptions,
  title = "New Thread",
  description,
  placeholder,
  suggestions = [],
  emptyTitle = "What should we build?",
  emptyDescription = "The agent can read your code, run commands and make changes.",
  className,
}: ChatProps) {
  const [transport] = React.useState(() => new DefaultChatTransport({ api }))
  const { messages, sendMessage, setMessages, status, stop, error, regenerate } =
    useChat({ transport, ...chatOptions })
  const [draft, setDraft] = React.useState("")
  const busy = status === "submitted" || status === "streaming"

  async function send({ text, files }: PromptInputMessage) {
    setDraft("")
    void sendMessage({
      text,
      files: files.length > 0 ? await toFileParts(files) : undefined,
    })
  }

  return (
    <MessageScrollerProvider autoScroll>
      <div
        data-slot="chat"
        className={cn("flex h-full min-h-0 w-full flex-col gap-4", className)}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex flex-col gap-1">
            <div className="font-medium">{title}</div>
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="New conversation"
                  onClick={() => {
                    setMessages([])
                    setDraft("")
                  }}
                  disabled={busy || messages.length === 0}
                />
              }
            >
              <RotateCwIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>New conversation</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="min-h-0 flex-1">
          {messages.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircleDashedIcon />
                </EmptyMedia>
                <EmptyTitle>{emptyTitle}</EmptyTitle>
                <EmptyDescription>{emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent aria-busy={busy} className="gap-6 px-6 pb-4">
                  {messages.map((message, index) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      {message.role === "user" ? (
                        <UserMessage message={message} />
                      ) : (
                        <AssistantMessage
                          message={message}
                          streaming={busy && index === messages.length - 1}
                        />
                      )}
                    </MessageScrollerItem>
                  ))}
                  {error && (
                    <div className="flex items-center gap-3 text-sm text-destructive">
                      <span>Something went wrong.</span>
                      <Button variant="outline" size="sm" onClick={() => regenerate()}>
                        Retry
                      </Button>
                    </div>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          )}
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6">
          {suggestions.length > 0 && messages.length === 0 && (
            <Suggestions
              suggestions={suggestions}
              disabled={busy}
              onSelect={(text) => send({ text, files: [] })}
            />
          )}
          <PromptInput
            value={draft}
            onValueChange={setDraft}
            onSubmit={send}
            onStop={stop}
            busy={busy}
            placeholder={placeholder}
          />
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

export { Chat, AssistantMessage, UserMessage, getMessageText, type ChatProps }
