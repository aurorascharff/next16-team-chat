'use client'

import { SmilePlus } from 'lucide-react'
import { useState } from 'react'
import { useReactionToggle } from '@/features/message/hooks/message-mutations'
import type { Message } from '@/features/message/types/message'
import { cn } from '@/lib/utils'

const CHOICES = ['👍', '🎉', '❤️', '😂', '👀', '🚀', '✅', '🔥']

export function MessageReactions({ message }: { message: Message }) {
  const reactions = message.reactions ?? []
  const toggle = useReactionToggle(message)

  if (reactions.length === 0) {
    return null
  }

  return (
    <>
      {reactions.map((reaction) => {
        return (
          <button
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-colors',
              reaction.reacted
                ? 'border-accent/30 bg-accent-fade text-accent hover:border-accent/60'
                : 'border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent',
            )}
            key={reaction.emoji}
            onClick={() => {
              return toggle(reaction.emoji)
            }}
            type="button"
          >
            <span>{reaction.emoji}</span>
            {reaction.count}
          </button>
        )
      })}
    </>
  )
}

export function AddReaction({ message }: { message: Message }) {
  const [open, setOpen] = useState(false)
  const toggle = useReactionToggle(message)

  return (
    <div className="relative">
      <button
        aria-label="Add reaction"
        className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark hover:text-accent flex size-7 items-center justify-center rounded-md transition-colors"
        data-open={open}
        onClick={(event) => {
          event.currentTarget.blur()
          setOpen(!open)
        }}
        type="button"
      >
        <SmilePlus aria-hidden className="size-3.5" strokeWidth={2} />
      </button>
      {open ? (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              return setOpen(false)
            }}
          />
          <div className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark absolute top-9 right-0 z-20 flex gap-0.5 rounded-lg border p-1 shadow-lg">
            {CHOICES.map((emoji) => {
              return (
                <button
                  className="hover:bg-card dark:hover:bg-card-dark flex size-7 items-center justify-center rounded-md text-base transition-colors"
                  key={emoji}
                  onClick={() => {
                    setOpen(false)
                    toggle(emoji)
                  }}
                  type="button"
                >
                  {emoji}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
