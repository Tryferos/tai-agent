"use client"

import * as React from "react"
import { cjk } from "@streamdown/cjk"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import "katex/dist/katex.min.css"
import { Streamdown } from "streamdown"
import { cn } from "cn"

function Markdown({
  className,
  streaming = false,
  ...props
}: React.ComponentProps<typeof Streamdown> & {
  streaming?: boolean
}) {
  return (
    <Streamdown
      data-slot="markdown"
      plugins={{ cjk, math, mermaid }}
      mode={streaming ? "streaming" : "static"}
      isAnimating={streaming}
      animated={streaming ? { animation: "blurIn", sep: "word" } : false}
      className={cn(
        "min-w-0 text-sm leading-relaxed *:first:mt-0 *:last:mb-0",
        className
      )}
      {...props}
    />
  )
}

export { Markdown }
