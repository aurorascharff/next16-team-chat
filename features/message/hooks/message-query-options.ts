import { queryOptions } from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'
import type { Message } from '@/features/message/types/message'

export const messageKeys = {
  channel: (channelId: string) => ['messages', channelId] as const,
  replies: (messageId: string) => ['replies', messageId] as const,
}

export const mentionKeys = {
  unread: ['mentions', 'unread'] as const,
}

export function unreadMentionsQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<{ count: number }> => {
      const res = await fetch(apiUrl('/api/mentions/unread'))

      if (!res.ok) {
        throw new Error('Failed to fetch mentions')
      }

      return res.json()
    },
    queryKey: mentionKeys.unread,
    refetchInterval: 5_000,
    staleTime: 15_000,
  })
}

export function messagesQueryOptions(channelId: string) {
  return queryOptions({
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(apiUrl(`/api/channels/${channelId}/messages`))

      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }

      return res.json()
    },
    queryKey: messageKeys.channel(channelId),
    refetchInterval: 10_000,
    staleTime: Infinity,
  })
}

export function repliesQueryOptions(messageId: string) {
  return queryOptions({
    queryFn: async (): Promise<Message[]> => {
      const res = await fetch(apiUrl(`/api/messages/${messageId}/replies`))

      if (!res.ok) {
        throw new Error('Failed to fetch replies')
      }

      return res.json()
    },
    queryKey: messageKeys.replies(messageId),
    refetchInterval: 10_000,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
