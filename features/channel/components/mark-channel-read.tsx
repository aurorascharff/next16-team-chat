'use client'

import { useEffect, useEffectEvent } from 'react'
import { useMarkChannelRead } from '@/features/channel/hooks/use-mark-channel-read'

export function MarkChannelRead({
  channelId,
  hasUnread,
}: {
  channelId: string
  hasUnread: boolean
}) {
  const markRead = useEffectEvent(useMarkChannelRead())

  useEffect(() => {
    if (!hasUnread) return
    void markRead(channelId)
  }, [channelId, hasUnread])

  return null
}
