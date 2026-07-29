import { WorkspacePanel } from '@/features/workspace/components/workspace-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/inbox' },
  description: 'Mentions, review requests, and handoffs from active channels.',
  title: 'Inbox',
}

export default function InboxPage() {
  return <WorkspacePanel view="inbox" />
}
