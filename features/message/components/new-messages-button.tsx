'use client'

import { ArrowDownIcon, XIcon } from 'lucide-react'

export function NewMessagesButton({
  count,
  onDismiss,
  onScrollToEnd,
}: {
  count: number
  onDismiss: () => void
  onScrollToEnd: () => void
}) {
  if (count === 0) {
    return null
  }

  const label = count === 1 ? '1 new message' : `${count} new messages`

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
    >
      <div className="border-accent/20 bg-surface/95 dark:bg-elevated-dark/95 flex items-center overflow-hidden rounded-md border shadow-sm backdrop-blur">
        <button
          className="text-accent hover:bg-accent-fade pointer-events-auto flex h-8 items-center gap-2 px-2 text-xs font-semibold transition-colors"
          onClick={() => {
            onScrollToEnd()
          }}
          type="button"
        >
          <ArrowDownIcon
            aria-hidden
            className="text-accent size-3.5"
            strokeWidth={2.5}
          />
          {label}
        </button>
        <button
          aria-label="Dismiss new message indicator"
          className="border-accent/20 text-muted dark:text-muted-dark hover:bg-accent-fade hover:text-accent pointer-events-auto flex size-8 items-center justify-center border-l transition-colors"
          onClick={onDismiss}
          type="button"
        >
          <XIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
