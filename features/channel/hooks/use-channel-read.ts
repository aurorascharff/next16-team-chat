'use client'

import { skipToken, useQuery } from '@tanstack/react-query'
import { channelKeys } from '@/features/channel/channel-cache'
import { useVisitSnapshot } from '@/lib/use-visit-snapshot'

export function useChannelReadOnEntry(
  channelId: string,
  initialLastReadAt: string | null,
) {
  const { data: latestLastReadAt = initialLastReadAt } = useQuery({
    initialData: initialLastReadAt,
    queryFn: skipToken,
    queryKey: channelKeys.lastRead(channelId),
  })

  return useVisitSnapshot(latestLastReadAt)
}
