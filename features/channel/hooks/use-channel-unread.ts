'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { channelKeys } from '@/features/channel/channel-cache'
import {
  type UnreadChannels,
  unreadChannelsQueryOptions,
} from '@/features/channel/channel-query-options'
import { useIsMounted } from '@/lib/use-is-mounted'

export function useChannelUnread(channelId: string, initialUnread?: number) {
  const queryClient = useQueryClient()
  const mounted = useIsMounted()
  const { data: unreadMap } = useQuery(unreadChannelsQueryOptions())

  const unread = unreadMap ? unreadMap[channelId] : initialUnread

  return {
    clearUnread() {
      queryClient.setQueryData<UnreadChannels>(
        channelKeys.unread,
        (current = {}) => {
          const next = { ...current }
          delete next[channelId]
          return next
        },
      )
    },
    hasUnread: mounted && Boolean(unread),
  }
}
