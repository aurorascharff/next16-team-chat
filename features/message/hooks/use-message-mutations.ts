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

type SendMessageVariables = {
  channelId: string
  message: Message
  parentId?: string
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, message, parentId }: SendMessageVariables) => {
      return sendMessage({ body: message.body, channelId, parentId })
    },
    onMutate: ({ channelId, message, parentId }) => {
      const key = parentId
        ? messageKeys.replies(parentId)
        : messageKeys.channel(channelId)
      queryClient.setQueryData<Message[]>(key, (current = []) => {
        const exists = current.some((item) => item.id === message.id)
        if (exists) {
          return current.map((item) =>
            item.id === message.id ? { ...item, status: 'sending' } : item,
          )
        }
        return [...current, message]
      })
    },
    onSuccess: (result, { channelId, message, parentId }) => {
      const key = parentId
        ? messageKeys.replies(parentId)
        : messageKeys.channel(channelId)
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((item) =>
          item.id === message.id
            ? result.ok
              ? { ...result.message, status: 'sent' }
              : { ...item, status: 'failed' }
            : item,
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

      if (result.ok && /@huddlebot\b/i.test(message.body)) {
        const threadParent = parentId ?? result.message.id
        queryClient.setQueryData(messageKeys.botTyping(threadParent), {
          startedAt: new Date().toISOString(),
        })
      }
    },
    onError: (_error, { channelId, message, parentId }) => {
      const key = parentId
        ? messageKeys.replies(parentId)
        : messageKeys.channel(channelId)
      queryClient.setQueryData<Message[]>(key, (current = []) =>
        current.map((item) =>
          item.id === message.id ? { ...item, status: 'failed' } : item,
        ),
      )
    },
  })
}
