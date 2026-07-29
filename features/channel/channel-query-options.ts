import { queryOptions } from '@tanstack/react-query'

export type UnreadChannels = Record<string, number>

export const channelKeys = {
  unread: ['channels', 'unread'] as const,
}

export function unreadChannelsQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<UnreadChannels> => {
      const res = await fetch('/api/channels/unread')

      if (!res.ok) {
        throw new Error('Failed to fetch unread channels')
      }

      return res.json()
    },
    queryKey: channelKeys.unread,
    staleTime: 15_000,
  })
}
