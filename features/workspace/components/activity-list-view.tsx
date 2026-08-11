'use client'

import { Fragment } from 'react'
import { Boundary } from '@/components/internal/boundary'
import { Crossfade } from '@/components/ui/crossfade'
import type { ActivityItem } from '@/features/workspace/workspace-queries'
import { useVisitSnapshot } from '@/lib/use-visit-snapshot'
import { ActivityRow } from './activity-row'
import { MarkActivityRead } from './mark-activity-read'

export function ActivityListView({ items }: { items: ActivityItem[] }) {
  const itemsOnEntry = useVisitSnapshot(items)
  const firstReadIndex = itemsOnEntry.findIndex((item) => item.read)
  const hasDivider =
    itemsOnEntry.some((item) => !item.read) && firstReadIndex > 0
  const firstReadId = hasDivider ? itemsOnEntry[firstReadIndex]?.id : undefined
  const unreadIds = itemsOnEntry
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
        <Boundary label="ActivityList" asChild>
          <div className="flex flex-col p-3">
            {itemsOnEntry.map((item) => {
              return (
                <Fragment key={item.id}>
                  {item.id === firstReadId ? <ActivityDivider /> : null}
                  <ActivityRow item={item} />
                </Fragment>
              )
            })}
          </div>
        </Boundary>
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
