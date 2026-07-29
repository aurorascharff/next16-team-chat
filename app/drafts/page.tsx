import { EmptyState } from '@/components/ui/empty-state'
import { WorkspacePanelHeader } from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/drafts' },
  description: 'Drafted notes that stay local until sent to a channel.',
  title: 'Drafts',
}

export default function DraftsPage() {
  return (
    <section className="min-h-dvh">
      <WorkspacePanelHeader view="drafts" />
      <EmptyState
        body="Messages you start but don't send will wait for you here."
        title="No drafts yet"
      />
    </section>
  )
}
