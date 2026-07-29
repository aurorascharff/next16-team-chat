'use client'

import { type ReactNode } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { useThread } from './thread-context'
import { ThreadPanel } from './thread-panel'

export function ChannelDetailPanel({ details }: { details: ReactNode }) {
  const { activeThread } = useThread()

  return (
    <ResizablePanel>
      {activeThread ? (
        <ThreadPanel
          channelId={activeThread.channelId}
          messageId={activeThread.messageId}
        />
      ) : (
        details
      )}
    </ResizablePanel>
  )
}
