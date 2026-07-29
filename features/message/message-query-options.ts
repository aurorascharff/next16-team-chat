import { queryOptions } from '@tanstack/react-query'
import type { Message } from './types/message'

export const messageKeys = {
  channel: (channelId: string) => ['messages', channelId] as const,
  replies: (messageId: string) => ['replies', messageId] as const,
}

export function messagesQueryOptions(channelId: string) {
  return queryOptions({
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(`/api/channels/${channelId}/messages`)

      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }

      return res.json()
    },
    queryKey: messageKeys.channel(channelId),
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export function repliesQueryOptions(messageId: string) {
  return queryOptions({
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(`/api/messages/${messageId}/replies`)

      if (!res.ok) {
        throw new Error('Failed to fetch replies')
      }

      return res.json()
    },
    queryKey: messageKeys.replies(messageId),
    staleTime: Number.POSITIVE_INFINITY,
  })
}
