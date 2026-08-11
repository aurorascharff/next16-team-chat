'use client'

import { useEffect } from 'react'
import { useMarkChannelRead } from '@/features/channel/hooks/use-mark-channel-read'

export function MarkChannelRead({
  channelId,
  hasUnread,
}: {
  channelId: string
  hasUnread: boolean
}) {
  const { mutate } = useMarkChannelRead()

  useEffect(() => {
    if (!hasUnread) return
    mutate(channelId)
  }, [channelId, hasUnread, mutate])

  return null
}
