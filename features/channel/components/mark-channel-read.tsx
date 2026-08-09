'use client'

import { useEffect } from 'react'
import { useMarkChannelRead } from '@/features/channel/hooks/use-mark-channel-read'

export function MarkChannelRead({ channelId }: { channelId: string }) {
  const { mutate } = useMarkChannelRead()

  useEffect(() => {
    mutate(channelId)
  }, [channelId, mutate])

  return null
}
