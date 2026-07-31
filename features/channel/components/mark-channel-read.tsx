'use client'

import { useEffect, useEffectEvent } from 'react'
import { useMarkChannelRead } from '@/features/channel/hooks/use-mark-channel-read'

export function MarkChannelRead({ channelId }: { channelId: string }) {
  const markRead = useEffectEvent(useMarkChannelRead())

  useEffect(() => {
    void markRead(channelId)
  }, [channelId])

  return null
}
