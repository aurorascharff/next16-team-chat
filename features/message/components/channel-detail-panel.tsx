'use client'

import { type ReactNode } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { ThreadPanel } from './thread-panel'
import { useThread } from './use-thread'

export function ChannelDetailPanel({ details }: { details: ReactNode }) {
  const { activeThread } = useThread()

  return (
    <>
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
      {activeThread ? (
        <div className="bg-surface dark:bg-surface-dark fixed inset-0 z-50 flex flex-col lg:hidden">
          <ThreadPanel
            channelId={activeThread.channelId}
            messageId={activeThread.messageId}
          />
        </div>
      ) : null}
    </>
  )
}
