'use client'

import { useSWRConfig } from 'swr'
import { markChannelReadAction } from '@/features/channel/channel-actions'
import { channelKeys } from '@/features/channel/channel-cache'
import type { UnreadChannels } from '@/features/channel/hooks/use-unread-channels'

function removeChannel(current: UnreadChannels | undefined, channelId: string) {
  const next = { ...current }
  delete next[channelId]
  return next
}

export function useMarkChannelRead() {
  const { mutate } = useSWRConfig()

  return async function markChannelRead(channelId: string) {
    await mutate<UnreadChannels>(
      channelKeys.unread,
      async (current) => {
        const readAt = await markChannelReadAction(channelId)
        await mutate(channelKeys.lastRead(channelId), readAt, {
          revalidate: false,
        })
        return removeChannel(current, channelId)
      },
      {
        optimisticData: (current) => removeChannel(current, channelId),
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      },
    )
  }
}
