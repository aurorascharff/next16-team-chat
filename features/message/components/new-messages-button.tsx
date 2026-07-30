'use client'

import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react'

export function NewMessagesButton({
  count,
  onDismiss,
  onScrollToEnd,
}: {
  count: number
  onDismiss: () => void
  onScrollToEnd: () => void
}) {
  return (
    <MessageJumpButton
      count={count}
      direction="down"
      label={(value) => {
        return value === 1 ? '1 new message' : `${value} new messages`
      }}
      onDismiss={onDismiss}
      onJump={onScrollToEnd}
    />
  )
}

export function UnreadMessagesButton({
  count,
  onScrollToUnread,
}: {
  count: number
  onScrollToUnread: () => void
}) {
  return (
    <MessageJumpButton
      count={count}
      direction="up"
      label={(value) => {
        return value === 1 ? '1 unread' : `${value} unread`
      }}
      onJump={onScrollToUnread}
    />
  )
}

function MessageJumpButton({
  count,
  direction,
  label,
  onDismiss,
  onJump,
}: {
  count: number
  direction: 'down' | 'up'
  label: (count: number) => string
  onDismiss?: () => void
  onJump: () => void
}) {
  if (count === 0) {
    return null
  }

  const Icon = direction === 'up' ? ArrowUpIcon : ArrowDownIcon

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
    >
      <div className="border-accent/20 bg-surface/95 dark:bg-elevated-dark/95 flex items-center overflow-hidden rounded-md border shadow-sm backdrop-blur">
        <button
          className="text-accent hover:bg-accent-fade pointer-events-auto flex items-center gap-2 px-2 py-1.5 text-xs font-semibold transition-colors"
          onClick={() => {
            onJump()
          }}
          type="button"
        >
          <Icon
            aria-hidden
            className="text-accent size-3.5"
            strokeWidth={2.5}
          />
          {label(count)}
        </button>
        {onDismiss ? (
          <button
            aria-label="Dismiss new message indicator"
            className="border-accent/20 text-accent hover:bg-accent-fade pointer-events-auto flex min-w-8 items-center justify-center self-stretch border-l px-2 transition-colors"
            onClick={onDismiss}
            type="button"
          >
            <XIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </div>
  )
}
