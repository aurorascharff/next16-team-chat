import { AtSign, CornerUpLeft, Hash, Reply } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { Fragment } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/ui/user-avatar'
import { formatInline } from '@/features/message/utils/format'
import {
  type ActivityItem,
  getActivity,
} from '@/features/workspace/workspace-queries'
import { cn } from '@/lib/utils'

const ACTION: Record<
  ActivityItem['kind'],
  { icon: typeof Reply; label: string }
> = {
  mention: { icon: AtSign, label: 'mentioned you in' },
  'reply-in-thread': { icon: Reply, label: 'replied in a thread you follow' },
  'reply-to-you': { icon: Reply, label: 'replied to your message' },
}

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

  return (
    <div className="flex flex-col p-3">
      {items.map((item) => {
        const action = ACTION[item.kind]
        const ActionIcon = action.icon
        const href =
          `/channel/${item.channelId}?thread=${item.messageId}` as Route

        return (
          <Fragment key={item.id}>
            {item.id === firstReadId ? <ActivityDivider /> : null}
            <Link
              className={cn(
                'group hover:bg-card dark:hover:bg-card-dark flex gap-3 rounded-xl px-3 py-3 transition-colors',
                !item.read && 'bg-accent-fade/40 dark:bg-accent/5',
              )}
              href={href}
              prefetch={true}
            >
              <UserAvatar bot={item.actorIsBot} name={item.actor} />
              <div className="min-w-0 flex-1">
                <div className="text-muted dark:text-muted-dark flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.8125rem]">
                  <ActionIcon
                    className="text-accent size-3.5"
                    strokeWidth={2}
                  />
                  <strong className="font-semibold text-black dark:text-white">
                    {item.actor}
                  </strong>
                  <span>{action.label}</span>
                  <span className="inline-flex items-center font-medium text-black/80 dark:text-white/80">
                    <Hash className="size-3" strokeWidth={2} />
                    {item.channelName}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-black dark:text-white">
                  {formatInline(item.preview)}
                </p>
                {item.context ? (
                  <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark mt-2 flex items-start gap-1.5 border-l-2 pl-2.5 text-xs">
                    <CornerUpLeft
                      className="mt-0.5 size-3 shrink-0"
                      strokeWidth={2}
                    />
                    <span className="line-clamp-1">
                      {formatInline(item.context)}
                    </span>
                  </div>
                ) : null}
              </div>
              {!item.read ? (
                <span
                  aria-label="Unread"
                  className="bg-accent mt-1.5 inline-flex size-2 shrink-0 rounded-full"
                />
              ) : null}
            </Link>
          </Fragment>
        )
      })}
    </div>
  )
}

function ActivityDivider() {
  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <span className="text-muted dark:text-muted-dark text-xs font-semibold">
        Earlier
      </span>
      <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
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
