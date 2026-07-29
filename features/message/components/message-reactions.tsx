'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SmilePlus } from 'lucide-react'
import { useState } from 'react'
import { reactToMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-query-options'
import type { Message, Reaction } from '@/features/message/types/message'
import { cn } from '@/lib/utils'

const CHOICES = ['👍', '🎉', '❤️', '😂', '👀', '🚀', '✅', '🔥']

function applyToggle(reactions: Reaction[] = [], emoji: string): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  if (!existing) {
    return [...reactions, { count: 1, emoji, reacted: true }]
  }
  return reactions
    .map((reaction) => {
      if (reaction.emoji !== emoji) return reaction
      const count = reaction.count + (reaction.reacted ? -1 : 1)
      return { ...reaction, count, reacted: !reaction.reacted }
    })
    .filter((reaction) => reaction.count > 0)
}

function useReactionToggle(message: Message) {
  const queryClient = useQueryClient()
  const key = message.parentId
    ? messageKeys.replies(message.parentId)
    : messageKeys.channel(message.channelId)

  const { mutate } = useMutation({
    mutationFn: (emoji: string) => {
      return reactToMessage({
        channelId: message.channelId,
        emoji,
        messageId: message.id,
        parentId: message.parentId ?? undefined,
      })
    },
    onError: (_error, _emoji, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(key, context.previous)
      }
    },
    onMutate: async (emoji: string) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Message[]>(key)
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, reactions: applyToggle(item.reactions, emoji) }
            : item,
        ),
      )
      return { previous }
    },
  })

  return mutate
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
        return (
          <button
            className={cn(
              'flex h-6 items-center gap-1 rounded-full border px-2 text-xs font-medium transition-colors',
              reaction.reacted
                ? 'border-accent bg-accent-fade text-accent'
                : 'border-divider dark:border-divider-dark hover:border-accent text-muted dark:text-muted-dark',
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
        className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent flex size-7 items-center justify-center rounded-md border shadow-sm transition-colors"
        onClick={() => {
          return setOpen((value) => !value)
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
