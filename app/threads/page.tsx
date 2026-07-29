import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import {
  ThreadsList,
  WorkspaceListSkeleton,
  WorkspacePanelHeader,
} from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/threads' },
  description: 'Every thread across your channels, newest first.',
  title: 'Threads',
}

export default function ThreadsPage() {
  return (
    <section className="min-h-dvh">
      <WorkspacePanelHeader view="threads" />
      <Suspense fallback={<WorkspaceListSkeleton />}>
        <Crossfade>
          <ThreadsList />
        </Crossfade>
      </Suspense>
    </section>
  )
}
