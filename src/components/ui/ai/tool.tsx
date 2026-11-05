"use client"

import * as React from "react"
import { getToolName, type DynamicToolUIPart, type ToolUIPart } from "ai"
import { WrenchIcon } from "lucide-react"

import { CodeBlock, CodeBlockContent } from "@components/ui/code-block"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@components/ui/trace"

type AnyToolPart = ToolUIPart | DynamicToolUIPart

function format(value: unknown) {
  if (value === undefined) return ""
  if (typeof value === "string") return value
  return JSON.stringify(value, null, 2)
}

function Tool({
  part,
  streaming = false,
  icon = <WrenchIcon />,
  title,
  defaultOpen,
}: {
  part: AnyToolPart
  streaming?: boolean
  icon?: React.ReactNode
  title?: React.ReactNode
  defaultOpen?: boolean
}) {
  const name = getToolName(part)
  const settled =
    part.state === "output-available" ||
    part.state === "output-error" ||
    part.state === "output-denied"
  const failed = part.state === "output-error" || part.state === "output-denied"

  if (!settled) {
    return (
      <TraceLine status={streaming ? "running" : "error"}>
        <TraceIcon>{icon}</TraceIcon>
        <TraceTitle>
          {title ?? `${streaming ? "Running" : "Stopped"} ${name}`}
        </TraceTitle>
      </TraceLine>
    )
  }

  const output =
    part.state === "output-error"
      ? part.errorText
      : part.state === "output-denied"
        ? "The request was denied."
        : format(part.output)

  return (
    <TraceCollapsible defaultOpen={defaultOpen ?? failed}>
      <TraceCollapsibleTrigger>
        <TraceLine status={failed ? "error" : undefined}>
          <TraceIcon>{icon}</TraceIcon>
          <TraceTitle>{title ?? `${failed ? "Failed" : "Ran"} ${name}`}</TraceTitle>
          {part.state === "output-denied" && (
            <TraceDescription>Denied</TraceDescription>
          )}
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="flex flex-col gap-2">
        {part.input !== undefined && (
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-40">
              {format(part.input)}
            </CodeBlockContent>
          </CodeBlock>
        )}
        {output && (
          <CodeBlock size="sm" variant={failed ? "destructive" : "default"}>
            <CodeBlockContent wrap className="max-h-64">
              {output}
            </CodeBlockContent>
          </CodeBlock>
        )}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export { Tool, type AnyToolPart }
