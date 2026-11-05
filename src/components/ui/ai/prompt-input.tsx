"use client"

import * as React from "react"
import { ArrowUpIcon, FileTextIcon, PlusIcon, SquareIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@components/ui/attachment"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@components/ui/input-group"

type PromptInputMessage = {
  text: string
  files: File[]
}

function PromptInput({
  value,
  onValueChange,
  onSubmit,
  onStop,
  busy = false,
  placeholder = "Ask the agent...",
  allowAttachments = true,
  toolbar,
}: {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (message: PromptInputMessage) => void
  onStop?: () => void
  busy?: boolean
  placeholder?: string
  allowAttachments?: boolean
  toolbar?: React.ReactNode
}) {
  const [files, setFiles] = React.useState<{ id: string; file: File }[]>([])
  const formRef = React.useRef<HTMLFormElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const canSend = value.trim().length > 0 && !busy

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) return
    onSubmit({ text: value.trim(), files: files.map((item) => item.file) })
    setFiles([])
  }

  function handleAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files
    if (!selected) return
    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({ id: crypto.randomUUID(), file })),
    ])
    event.target.value = ""
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      {allowAttachments && (
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={handleAttach}
        />
      )}
      <InputGroup>
        {files.length > 0 && (
          <InputGroupAddon align="block-start" className="flex-wrap">
            {files.map(({ id, file }) => (
              <Attachment key={id} size="sm">
                <AttachmentMedia>
                  <FileTextIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setFiles((current) => current.filter((item) => item.id !== id))
                    }
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Message"
          className="min-h-14 p-3"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              formRef.current?.requestSubmit()
            }
          }}
        />
        <InputGroupAddon align="block-end">
          {allowAttachments && (
            <InputGroupButton
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Attach files"
              onClick={() => inputRef.current?.click()}
            >
              <PlusIcon />
            </InputGroupButton>
          )}
          <div className="ml-auto flex items-center gap-1">
            {toolbar}
            {busy && onStop ? (
              <InputGroupButton
                size="icon-sm"
                variant="default"
                className="rounded-full"
                aria-label="Stop"
                onClick={onStop}
              >
                <SquareIcon className="fill-current" />
              </InputGroupButton>
            ) : (
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="rounded-full"
                disabled={!canSend}
                aria-label="Send"
              >
                <ArrowUpIcon />
              </InputGroupButton>
            )}
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

export { PromptInput, type PromptInputMessage }
