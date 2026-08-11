'use client'

import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react'
import { Boundary } from '@/components/internal/boundary'

export function MessageJumpButton({
  count,
  direction,
  onDismiss,
  onJump,
}: {
  count: number
  direction: 'down' | 'up'
  onDismiss?: () => void
  onJump: () => void
}) {
  if (count === 0) return null

  const Icon = direction === 'up' ? ArrowUpIcon : ArrowDownIcon
  const label =
    direction === 'up'
      ? `${count} unread`
      : count === 1
        ? '1 new message'
        : `${count} new messages`

  return (
    <Boundary label="MessageJumpButton" asChild>
      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center"
      >
        <div className="border-accent/30 bg-surface/95 dark:bg-elevated-dark/95 flex h-8 items-stretch overflow-hidden rounded-md border shadow-sm backdrop-blur">
          <button
            className="text-accent hover:bg-accent-fade pointer-events-auto flex items-center gap-2 px-2.5 text-xs font-semibold"
            onClick={() => {
              onJump()
            }}
            type="button"
          >
            <Icon aria-hidden className="size-3.5" strokeWidth={2.5} />
            {label}
          </button>
          {onDismiss ? (
            <button
              aria-label="Dismiss new message indicator"
              className="border-accent/20 text-muted dark:text-muted-dark hover:bg-accent-fade hover:text-accent pointer-events-auto flex w-8 items-center justify-center border-l"
              onClick={() => {
                onDismiss()
              }}
              type="button"
            >
              <XIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      </div>
    </Boundary>
  )
}
