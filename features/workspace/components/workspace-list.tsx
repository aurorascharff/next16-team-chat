import { ArrowUpRight, Hash, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { EmptyState } from '@/components/ui/empty-state'
import { UserAvatar } from '@/components/ui/user-avatar'
import { stripMarkdown } from '@/features/message/components/format'
import type { WorkspaceItem } from '@/features/workspace/workspace-queries'

export function WorkspaceList({
  emptyBody,
  emptyTitle,
  items,
  withThreads = false,
}: {
  emptyBody: string
  emptyTitle: string
  items: WorkspaceItem[]
  withThreads?: boolean
}) {
  if (items.length === 0) {
    return <EmptyState body={emptyBody} title={emptyTitle} />
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const href = (
          withThreads
            ? `/channel/${item.channelId}?thread=${item.id}`
            : `/channel/${item.channelId}`
        ) as Route

        return (
          <Link
            className="group border-divider dark:border-divider-dark hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 border-b px-5 py-3.5 transition-colors"
            href={href}
            key={item.id}
            prefetch={true}
          >
            <UserAvatar name={item.author} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <strong className="text-[0.9375rem] font-semibold">
                  {item.author}
                </strong>
                <span className="text-muted dark:text-muted-dark inline-flex items-center text-xs">
                  <Hash className="size-3" strokeWidth={2} />
                  {item.channelName}
                </span>
              </div>
              <p className="text-muted dark:text-muted-dark mt-0.5 truncate text-[0.8125rem]">
                {stripMarkdown(item.preview)}
              </p>
            </div>
            {withThreads && item.replyCount > 0 ? (
              <span className="text-muted dark:text-muted-dark inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                <MessageSquare className="size-3.5" strokeWidth={2} />
                {item.replyCount}
              </span>
            ) : null}
            <ArrowUpRight
              aria-hidden
              className="text-muted size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={2}
            />
          </Link>
        )
      })}
    </div>
  )
}
