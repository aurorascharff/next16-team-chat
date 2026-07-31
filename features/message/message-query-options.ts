import { queryOptions } from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'
import type { Message } from '@/features/message/types/message'
import { messageKeys } from './message-cache'

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
    refetchOnMount: 'always',
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
