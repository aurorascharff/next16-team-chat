'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reactToMessage, sendMessage } from '@/features/message/message-actions'
import { messageKeys } from '@/features/message/message-cache'
import type { Message, Reaction } from '@/features/message/types/message'

function applyReactionToggle(
  reactions: Reaction[] = [],
  emoji: string,
): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  if (!existing) {
    return [...reactions, { count: 1, emoji, reacted: true, users: ['You'] }]
  }
  return reactions
    .map((reaction) => {
      if (reaction.emoji !== emoji) return reaction
      const count = reaction.count + (reaction.reacted ? -1 : 1)
      const users = reaction.reacted
        ? reaction.users.slice(0, Math.max(0, count))
        : [...reaction.users, 'You']
      return { ...reaction, count, reacted: !reaction.reacted, users }
    })
    .filter((reaction) => reaction.count > 0)
}

export function useReactionToggle(message: Message) {
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
      toast.error('Could not update reaction. Try again.')
    },
    onMutate: async (emoji: string) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Message[]>(key)
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                reactions: applyReactionToggle(item.reactions, emoji),
              }
            : item,
        ),
      )
      return { previous }
    },
  })

  return mutate
}

export function useSendMessage({
  channelId,
  parentId,
}: {
  channelId: string
  parentId?: string
}) {
  const queryClient = useQueryClient()
  const key = parentId
    ? messageKeys.replies(parentId)
    : messageKeys.channel(channelId)

  return useMutation({
    mutationFn: (optimistic: Message) => {
      return sendMessage({ body: optimistic.body, channelId, parentId })
    },
    onMutate: (optimistic: Message) => {
      queryClient.setQueryData<Message[]>(key, (current = []) => {
        const exists = current.some((message) => message.id === optimistic.id)
        if (exists) {
          return current.map((message) =>
            message.id === optimistic.id
              ? { ...message, status: 'sending' }
              : message,
          )
        }
        return [...current, optimistic]
      })
    },
    onSuccess: (result, optimistic) => {
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id
            ? result.ok
              ? { ...result.message, status: 'sent' }
              : { ...message, status: 'failed' }
            : message,
        ),
      )

      if (result.ok && parentId) {
        queryClient.setQueryData<Message[]>(
          messageKeys.channel(channelId),
          (current = []) =>
            current.map((message) =>
              message.id === parentId
                ? { ...message, replyCount: (message.replyCount ?? 0) + 1 }
                : message,
            ),
        )
      }
    },
    onError: (_error, optimistic) => {
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((message) =>
          message.id === optimistic.id
            ? { ...message, status: 'failed' }
            : message,
        ),
      )
    },
  })
}
