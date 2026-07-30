import { AtSign, Hash, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { Fragment } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/ui/user-avatar'
import { stripMarkdown } from '@/features/message/components/format'
import { getActivity } from '@/features/workspace/workspace-queries'
import { cn } from '@/lib/utils'

export async function ActivityList() {
  const items = await getActivity()

  if (items.length === 0) {
    return (
      <EmptyState
        body="Mentions and thread replies show up here as they happen."
        title="Nothing yet"
      />
    )
  }

  const firstReadIndex = items.findIndex((item) => item.read)
  const hasDivider = items.some((item) => !item.read) && firstReadIndex > 0
  const lastUnreadId = hasDivider ? items[firstReadIndex - 1]?.id : undefined
  const firstReadId = hasDivider ? items[firstReadIndex]?.id : undefined

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const href =
          `/channel/${item.channelId}?thread=${item.messageId}` as Route

        return (
          <Fragment key={item.id}>
            {item.id === firstReadId ? <ActivityDivider /> : null}
            <Link
              className={cn(
                'group hover:bg-card dark:hover:bg-card-dark border-divider dark:border-divider-dark flex items-center gap-3 px-5 py-3.5 transition-colors',
                item.id === lastUnreadId ? '' : 'border-b',
              )}
              href={href}
              prefetch={true}
            >
              <UserAvatar name={item.author} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <strong className="text-[0.9375rem] font-semibold">
                    {item.author}
                  </strong>
                  {item.kind === 'mention' ? (
                    <span className="text-accent inline-flex items-center text-xs font-medium">
                      <AtSign className="size-3" strokeWidth={2} />
                      mentioned you
                    </span>
                  ) : null}
                  <span className="text-muted dark:text-muted-dark inline-flex items-center text-xs">
                    <Hash className="size-3" strokeWidth={2} />
                    {item.channelName}
                  </span>
                </div>
                <p className="text-muted dark:text-muted-dark mt-0.5 truncate text-[0.8125rem]">
                  {stripMarkdown(item.preview)}
                </p>
              </div>
              {item.replyCount > 0 ? (
                <span className="text-muted dark:text-muted-dark inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                  <MessageSquare className="size-3.5" strokeWidth={2} />
                  {item.replyCount}
                </span>
              ) : null}
              {!item.read ? (
                <span
                  aria-label="Unread"
                  className="bg-accent inline-flex size-2 shrink-0 rounded-full"
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
    <div className="flex items-center gap-2 px-5 py-2">
      <span className="text-accent text-xs font-semibold">Earlier</span>
      <span className="bg-accent/40 h-px flex-1" />
    </div>
  )
}

export function ActivityListSkeleton() {
  return (
    <div className="flex flex-col">
      {['w-full', 'w-4/5', 'w-full', 'w-2/3'].map((width, index) => {
        return (
          <div
            className="border-divider dark:border-divider-dark flex items-center gap-3 border-b px-5 py-3.5"
            key={index}
          >
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-32 rounded-full" />
              <Skeleton className={`h-3 max-w-md rounded-full ${width}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
