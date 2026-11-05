"use client"

import type { SourceUrlUIPart } from "ai"
import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

function hostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function Sources({
  sources,
  defaultOpen,
}: {
  sources: SourceUrlUIPart[]
  defaultOpen?: boolean
}) {
  const unique = sources.filter(
    (source, index, all) =>
      all.findIndex((other) => other.url === source.url) === index
  )

  if (unique.length === 0) {
    return null
  }

  return (
    <Trace>
      <TraceCollapsible defaultOpen={defaultOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>
              Used {unique.length} {unique.length === 1 ? "source" : "sources"}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {unique.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceTitle>
                    {source.title ?? hostname(source.url)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightIcon />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

export { Sources }
