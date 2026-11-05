"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

function Suggestions({
  suggestions,
  onSelect,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  disabled?: boolean
}) {
  return (
    <div
      data-slot="suggestions"
      className={cn(
        "flex scroll-fade-x scrollbar-none gap-2 overflow-x-auto overscroll-x-contain",
        className
      )}
      {...props}
    >
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

export { Suggestions }
