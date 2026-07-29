import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import {
  InboxList,
  WorkspaceListSkeleton,
  WorkspacePanelHeader,
} from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/inbox' },
  description: 'Conversations with replies that may need a follow-up.',
  title: 'Inbox',
}

export default function InboxPage() {
  return (
    <section className="min-h-dvh">
      <WorkspacePanelHeader view="inbox" />
      <Suspense fallback={<WorkspaceListSkeleton />}>
        <Crossfade>
          <InboxList />
        </Crossfade>
      </Suspense>
    </section>
  )
}
