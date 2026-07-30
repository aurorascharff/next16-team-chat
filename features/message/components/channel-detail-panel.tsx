'use client'

import { Suspense, type ReactNode } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { ThreadPanel } from './thread-panel'
import { useThread } from '@/features/message/hooks/use-thread'

export function ChannelDetailPanel({ details }: { details: ReactNode }) {
  return (
    <>
      <ResizablePanel>
        <Suspense fallback={details}>
          <ChannelDetailPanelContent details={details} />
        </Suspense>
      </ResizablePanel>
      <Suspense fallback={null}>
        <MobileThreadPanel />
      </Suspense>
    </>
  )
}

function ChannelDetailPanelContent({ details }: { details: ReactNode }) {
  const { activeThread } = useThread()

  if (!activeThread) {
    return details
  }

  return (
    <ThreadPanel
      channelId={activeThread.channelId}
      messageId={activeThread.messageId}
    />
  )
}

function MobileThreadPanel() {
  const { activeThread } = useThread()

  if (!activeThread) {
    return null
  }

  return (
    <div className="bg-surface dark:bg-surface-dark fixed inset-0 z-50 flex flex-col lg:hidden">
      <ThreadPanel
        channelId={activeThread.channelId}
        messageId={activeThread.messageId}
      />
    </div>
  )
}
