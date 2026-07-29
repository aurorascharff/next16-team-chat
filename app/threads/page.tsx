import { WorkspacePanel } from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/threads' },
  description: 'Follow-ups collected from channel conversations.',
  title: 'Threads',
}

export default function ThreadsPage() {
  return <WorkspacePanel view="threads" />
}
