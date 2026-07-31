'use client'

import useSWR from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import { useVisitSnapshot } from '@/lib/use-visit-snapshot'

export function useChannelReadOnEntry(
  channelId: string,
  initialLastReadAt: string | null,
) {
  const { data: latestLastReadAt = initialLastReadAt } = useSWR<string | null>(
    channelKeys.lastRead(channelId),
    null,
    {
      fallbackData: initialLastReadAt,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return useVisitSnapshot(latestLastReadAt)
}
