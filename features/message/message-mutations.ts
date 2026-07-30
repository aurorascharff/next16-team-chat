'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reactToMessage, sendMessage } from '@/features/message/message-actions'
import { markMentionsReadAction } from '@/features/message/message-mention-actions'
import { mentionKeys } from '@/features/message/message-mention-query-options'
import { messageKeys } from '@/features/message/message-query-options'
import type { Message, Reaction } from '@/features/message/types/message'

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
            ? { ...item, reactions: applyToggle(item.reactions, emoji) }
            : item,
        ),
      )
      return { previous }
    },
  })

  return mutate
}

export function useMarkMentionsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markMentionsReadAction(),
    onSuccess: () => {
      queryClient.setQueryData(mentionKeys.unread, { count: 0 })
    },
  })
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
    onError: () => {
      toast.error('Could not send message. Try again.')
    },
    onMutate: (optimistic: Message) => {
      queryClient.setQueryData<Message[]>(key, (current = []) => [
        ...current,
        optimistic,
      ])
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

      if (!result.ok) {
        toast.error(result.error)
      }
    },
  })
}
