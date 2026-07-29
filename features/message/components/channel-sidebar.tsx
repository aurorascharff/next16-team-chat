'use client'

import type { ReactNode } from 'react'
import { useThread } from './thread-context'
import { ThreadPanel } from './thread-panel'

export function ChannelSidebar({ details }: { details: ReactNode }) {
  const { activeThread } = useThread()

  if (activeThread) {
    return (
      <ThreadPanel
        channelId={activeThread.channelId}
        messageId={activeThread.messageId}
      />
    )
  }

  return details
}
