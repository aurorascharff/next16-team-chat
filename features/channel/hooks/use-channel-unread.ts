'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  channelKeys,
  type UnreadChannels,
  unreadChannelsQueryOptions,
} from '@/features/channel/channel-query-options'

export function useChannelUnread(channelId: string, initialUnread?: number) {
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const { data: unreadMap } = useQuery(unreadChannelsQueryOptions())

  useEffect(() => {
    setMounted(true)
  }, [])

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
