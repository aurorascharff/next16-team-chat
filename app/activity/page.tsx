import { Suspense } from 'react'
import {
  ActivityList,
  ActivityListSkeleton,
} from '@/features/workspace/components/activity-list'
import { ClearActivityIndicator } from '@/features/workspace/components/clear-activity-indicator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/activity' },
  description: 'Mentions and conversations that may need a follow-up.',
  title: 'Activity',
}

export default function ActivityPage() {
  return (
    <section className="min-h-dvh">
      <ClearActivityIndicator />
      <header
        className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 border-b px-5 py-4 backdrop-blur-lg"
        style={{ viewTransitionName: 'activity-header' }}
      >
        <h1>Activity</h1>
        <p className="text-muted dark:text-muted-dark mt-1 text-sm">
          Mentions and thread replies across your channels, newest first.
        </p>
      </header>
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList />
      </Suspense>
    </section>
  )
}
