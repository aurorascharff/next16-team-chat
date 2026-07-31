'use client'

import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import {
  type UnreadChannels,
  useUnreadChannels,
} from '@/features/channel/hooks/use-unread-channels'

export function useChannelUnread(channelId: string, initialUnread?: number) {
  const { mutate } = useSWRConfig()
  const [mounted, setMounted] = useState(false)
  const { data: unreadMap } = useUnreadChannels()

  useEffect(() => {
    setMounted(true)
  }, [])

  const unread = unreadMap ? unreadMap[channelId] : initialUnread

  return {
    clearUnread() {
      void mutate<UnreadChannels>(
        channelKeys.unread,
        (current = {}) => {
          const next = { ...current }
          delete next[channelId]
          return next
        },
        { revalidate: false },
      )
    },
    hasUnread: mounted && Boolean(unread),
  }
}
