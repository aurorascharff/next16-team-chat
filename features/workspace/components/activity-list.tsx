import { Fragment } from 'react'
import { Crossfade } from '@/components/ui/crossfade'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { getActivity } from '@/features/workspace/workspace-queries'
import { ActivityRow } from './activity-row'
import { MarkActivityRead } from './mark-activity-read'

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

  const firstReadIndex = items.findIndex((item) => item.read)
  const hasDivider = items.some((item) => !item.read) && firstReadIndex > 0
  const firstReadId = hasDivider ? items[firstReadIndex]?.id : undefined
  const unreadIds = items
    .filter((item) => {
      return !item.read
    })
    .map((item) => {
      return item.id
    })

  return (
    <>
      <MarkActivityRead itemIds={unreadIds} />
      <Crossfade>
        <div className="flex flex-col p-3">
          {items.map((item) => {
            return (
              <Fragment key={item.id}>
                {item.id === firstReadId ? <ActivityDivider /> : null}
                <ActivityRow item={item} />
              </Fragment>
            )
          })}
        </div>
      </Crossfade>
    </>
  )
}

function ActivityDivider() {
  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <span className="text-accent text-xs font-semibold">Earlier</span>
      <span className="bg-accent/40 h-px flex-1" />
    </div>
  )
}

export function ActivityListSkeleton() {
  return (
    <div className="flex flex-col p-3">
      {['w-full', 'w-4/5', 'w-full', 'w-2/3'].map((width, index) => {
        return (
          <div className="flex gap-3 px-3 py-3" key={index}>
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
              <Skeleton className="h-3 w-48 rounded-full" />
              <Skeleton className={`h-3.5 max-w-md rounded-full ${width}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
