import { Skeleton } from '@/components/ui/skeleton'
import { getInbox } from '@/features/workspace/workspace-queries'
import { WorkspaceList } from './workspace-list'

const panels = {
  inbox: {
    body: 'Threads you started that got replies, plus threads you joined that others are active in.',
    title: 'Inbox',
  },
} as const

export type WorkspaceView = keyof typeof panels

export function WorkspacePanelHeader({ view }: { view: WorkspaceView }) {
  const panel = panels[view]

  return (
    <header className="border-divider dark:border-divider-dark bg-surface/80 dark:bg-surface-dark/80 sticky top-0 z-10 border-b px-5 py-4 backdrop-blur-lg">
      <h1>{panel.title}</h1>
      <p className="text-muted dark:text-muted-dark mt-1 text-sm">
        {panel.body}
      </p>
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
