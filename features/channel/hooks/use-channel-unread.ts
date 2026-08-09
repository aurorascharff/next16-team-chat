'use client'

import { useSWRConfig } from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import {
  type UnreadChannels,
  useUnreadChannels,
} from '@/features/channel/hooks/use-unread-channels'
import { useIsMounted } from '@/lib/use-is-mounted'

export function useChannelUnread(channelId: string, initialUnread?: number) {
  const { mutate } = useSWRConfig()
  const mounted = useIsMounted()
  const { data: unreadMap } = useUnreadChannels()

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
