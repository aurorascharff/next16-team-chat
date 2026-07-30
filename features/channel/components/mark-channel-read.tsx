'use client'

import { useEffect } from 'react'
import { useMarkChannelRead } from '@/features/channel/hooks/channel-mutations'

export function MarkChannelRead({ channelId }: { channelId: string }) {
  const markRead = useMarkChannelRead()

  useEffect(() => {
    markRead.mutate(channelId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  return null
}
