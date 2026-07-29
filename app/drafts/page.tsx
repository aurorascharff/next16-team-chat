import { WorkspacePanel } from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/drafts' },
  description: 'Drafted notes that stay local until sent to a channel.',
  title: 'Drafts',
}

export default function DraftsPage() {
  return <WorkspacePanel view="drafts" />
}
