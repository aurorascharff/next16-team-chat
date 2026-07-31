import { queryOptions } from '@tanstack/react-query'
import { channelKeys } from './channel-cache'

export type UnreadChannels = Record<string, number>

export type ChannelSearchItem = {
  id: string
  name: string
  group: string
  isPrivate: boolean
}

export function channelSearchQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<ChannelSearchItem[]> => {
      const res = await fetch('/api/channels')

      if (!res.ok) {
        throw new Error('Failed to fetch channels')
      }

      return res.json()
    },
    queryKey: channelKeys.all,
  })
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
    refetchInterval: 5_000,
  })
}
