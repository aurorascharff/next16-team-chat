import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { getActivity } from '@/features/workspace/workspace-queries'
import { ActivityListView } from './activity-list-view'

export async function ActivityList() {
  const items = await getActivity()

  if (items.length === 0) {
    return (
      <EmptyState
        body="Replies to your messages and threads you follow show up here."
        title="Nothing yet"
      />
    )
  }

  return <ActivityListView items={items} />
}

export function ActivityListSkeleton() {
  return (
    <div className="flex flex-col p-3 opacity-45">
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <div className="flex min-h-20 gap-3 px-3 py-3" key={index}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
              <Skeleton className="h-3 w-48 rounded" />
              {index < 3 ? (
                <Skeleton className="h-3.5 w-full max-w-md rounded" />
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
