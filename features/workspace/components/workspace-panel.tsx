import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { getInbox, getThreads } from '@/features/workspace/workspace-queries'
import { WorkspaceList } from './workspace-list'

const panels = {
  drafts: {
    body: 'Drafts stay local to this workspace until you send them to a channel.',
    title: 'Drafts',
  },
  inbox: {
    body: 'Conversations with replies that may need a follow-up from you.',
    title: 'Inbox',
  },
  threads: {
    body: 'Every thread across your channels, newest first.',
    title: 'Threads',
  },
} as const

export type WorkspaceView = keyof typeof panels

export function WorkspacePanelHeader({ view }: { view: WorkspaceView }) {
  const panel = panels[view]

  return (
    <header className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-4 backdrop-blur-lg">
      <div>
        <h1>{panel.title}</h1>
        <p className="text-muted dark:text-muted-dark mt-1 text-sm">
          {panel.body}
        </p>
      </div>
      <Link
        className="bg-accent hover:bg-accent-hover flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[0.8125rem] font-semibold text-white transition-colors"
        href="/channel/proj-ship-room"
        prefetch={true}
      >
        Open ship-room
        <ArrowRight aria-hidden className="size-3.5" strokeWidth={2.25} />
      </Link>
    </header>
  )
}

export async function InboxList() {
  const items = await getInbox()

  return (
    <WorkspaceList
      emptyBody="When a conversation gets replies, it shows up here."
      emptyTitle="Inbox is clear"
      items={items}
      withThreads
    />
  )
}

export async function ThreadsList() {
  const items = await getThreads()

  return (
    <WorkspaceList
      emptyBody="Start a thread from any message to see it here."
      emptyTitle="No threads yet"
      items={items}
      withThreads
    />
  )
}

export function WorkspaceListSkeleton() {
  return (
    <div className="flex flex-col">
      {['w-40', 'w-56', 'w-32', 'w-48'].map((width, i) => {
        return (
          <div
            className="border-divider dark:border-divider-dark flex items-center gap-3 border-b px-5 py-3.5"
            key={i}
          >
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-28 rounded-full" />
              <Skeleton className={`h-3 rounded-full ${width}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
