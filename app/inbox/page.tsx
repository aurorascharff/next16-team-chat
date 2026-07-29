import { Suspense } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { MarkMentionsRead } from '@/features/message/components/mark-mentions-read'
import {
  MentionsList,
  MentionsListSkeleton,
} from '@/features/message/components/mentions-list'
import {
  InboxList,
  WorkspaceListSkeleton,
  WorkspacePanelHeader,
} from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/inbox' },
  description: 'Mentions and conversations that may need a follow-up.',
  title: 'Activity',
}

export default function InboxPage() {
  return (
    <section className="min-h-dvh">
      <MarkMentionsRead />
      <div className="border-divider dark:border-divider-dark border-b px-5 pt-5 pb-3">
        <h1>Mentions</h1>
        <p className="text-muted dark:text-muted-dark mt-1 text-sm">
          Messages where someone @mentioned you.
        </p>
      </div>
      <Suspense fallback={<MentionsListSkeleton />}>
        <Crossfade>
          <MentionsList />
        </Crossfade>
      </Suspense>
      <WorkspacePanelHeader view="inbox" />
      <Suspense fallback={<WorkspaceListSkeleton />}>
        <Crossfade>
          <InboxList />
        </Crossfade>
      </Suspense>
    </section>
  )
}
