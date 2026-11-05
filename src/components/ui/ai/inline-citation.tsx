"use client"

import * as React from "react"

import { Button } from "@components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card"
import { getHostname } from "@lib/get-hostname"

function InlineCitation({
  url,
  title,
}: {
  url: string
  title?: React.ReactNode
}) {
  const hostname = getHostname(url)

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="secondary" size="xs" />}
      >
        {hostname}
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-1">
        <div className="font-medium">{title ?? hostname}</div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-muted-foreground underline-offset-4 hover:underline"
        >
          {url}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </HoverCardContent>
    </HoverCard>
  )
}

function InlineCitationLink({ href, children }: React.ComponentProps<"a">) {
  if (!href) {
    return children
  }

  return <InlineCitation url={href} title={children} />
}

export { InlineCitation, InlineCitationLink }
