"use client"

import * as React from "react"
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
