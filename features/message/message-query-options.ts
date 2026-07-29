import { queryOptions } from '@tanstack/react-query'
import type { Message } from './message-types'

export const messageKeys = {
  channel: (channelId: string) => ['messages', channelId] as const,
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
    staleTime: 15_000,
  })
}
