'use client'

import * as Ariakit from '@ariakit/react'
import { SmilePlus } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { useReactionToggle } from '@/features/message/hooks/use-message-mutations'
import type { Message, Reaction } from '@/features/message/types/message'
import { cn } from '@/lib/utils'

const CHOICES = ['👍', '🎉', '❤️', '😂', '👀', '🚀', '✅', '🔥']

function reactionLabel(reaction: Reaction) {
  if (reaction.users.length === 0) {
    return `${reaction.count} ${reaction.count === 1 ? 'reaction' : 'reactions'}`
  }

  if (reaction.users.length === 1) {
    return `${reaction.users[0]} reacted with ${reaction.emoji}`
  }

  if (reaction.users.length === 2) {
    return `${reaction.users[0]} and ${reaction.users[1]} reacted with ${reaction.emoji}`
  }

  const extra = reaction.users.length - 2
  return `${reaction.users[0]}, ${reaction.users[1]}, and ${extra} ${extra === 1 ? 'other' : 'others'} reacted with ${reaction.emoji}`
}

export function MessageReactions({ message }: { message: Message }) {
  const reactions = message.reactions ?? []
  const toggle = useReactionToggle(message)

  if (reactions.length === 0) {
    return null
  }

  return (
    <>
      {reactions.map((reaction) => {
        const label = reactionLabel(reaction)
        return (
          <button
            className={cn(
              'group/reaction relative flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-colors',
              reaction.reacted
                ? 'border-accent/30 bg-accent-fade text-accent hover:border-accent/60'
                : 'border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent',
            )}
            aria-label={label}
            key={reaction.emoji}
            onClick={() => {
              return toggle(reaction.emoji)
            }}
            type="button"
          >
            <span>{reaction.emoji}</span>
            {reaction.count}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md bg-zinc-950 px-2 py-1 text-center text-[0.6875rem] leading-snug font-medium whitespace-nowrap text-white shadow-lg group-hover/reaction:block group-focus-visible/reaction:block dark:bg-white dark:text-zinc-950">
              {label}
            </span>
          </button>
        )
      })}
    </>
  )
}

export function AddReaction({ message }: { message: Message }) {
  const popover = Ariakit.usePopoverStore({ placement: 'bottom-end' })
  const toggle = useReactionToggle(message)

  return (
    <>
      <IconButton
        className="hover:text-accent dark:hover:text-accent"
        label="Add reaction"
        render={<Ariakit.PopoverDisclosure store={popover} />}
        size="sm"
      >
        <SmilePlus aria-hidden className="size-3.5" strokeWidth={2} />
      </IconButton>
      <Ariakit.Popover
        className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark z-30 flex gap-0.5 rounded-lg border p-1 shadow-lg"
        gutter={8}
        portal
        store={popover}
        unmountOnHide
      >
        {CHOICES.map((emoji) => {
          return (
            <IconButton
              className="text-base"
              key={emoji}
              label={`React with ${emoji}`}
              onClick={() => {
                popover.hide()
                toggle(emoji)
              }}
              size="sm"
            >
              {emoji}
            </IconButton>
          )
        })}
      </Ariakit.Popover>
    </>
  )
}
