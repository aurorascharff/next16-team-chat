import { AtSign, Hash } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { EmptyState } from '@/components/ui/empty-state'
import { UserAvatar } from '@/components/ui/user-avatar'
import { getMentions } from '@/features/message/mention-queries'

export async function MentionsList() {
  const mentions = await getMentions()

  if (mentions.length === 0) {
    return (
      <EmptyState
        body="When someone @mentions you in a channel, it shows up here."
        title="No mentions yet"
      />
    )
  }

  return (
    <div className="flex flex-col">
      {mentions.map((mention) => {
        const href = `/channel/${mention.channelId}` as Route

        return (
          <Link
            className="group border-divider dark:border-divider-dark hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 border-b px-5 py-3.5 transition-colors"
            href={href}
            key={mention.id}
            prefetch={true}
          >
            <UserAvatar name={mention.author} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <strong className="text-[0.9375rem] font-semibold">
                  {mention.author}
                </strong>
                <span className="text-muted dark:text-muted-dark inline-flex items-center text-xs">
                  <Hash className="size-3" strokeWidth={2} />
                  {mention.channelName}
                </span>
              </div>
              <p className="text-muted dark:text-muted-dark mt-0.5 truncate text-[0.8125rem]">
                {mention.preview}
              </p>
            </div>
            {!mention.read ? (
              <span
                aria-label="Unread mention"
                className="bg-accent inline-flex size-2 shrink-0 rounded-full"
              />
            ) : (
              <AtSign
                aria-hidden
                className="text-muted dark:text-muted-dark size-4 shrink-0"
                strokeWidth={2}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}

export function MentionsListSkeleton() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2].map((index) => {
        return (
          <div
            className="border-divider dark:border-divider-dark flex items-center gap-3 border-b px-5 py-3.5"
            key={index}
          >
            <div className="bg-card dark:bg-card-dark size-9 shrink-0 animate-pulse rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="bg-card dark:bg-card-dark h-3.5 w-1/3 animate-pulse rounded-full" />
              <div className="bg-card dark:bg-card-dark h-3 w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
