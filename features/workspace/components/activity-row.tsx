'use client'

import { AtSign, CornerUpLeft, Hash, Reply } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { useEffect, useState } from 'react'
import { UserAvatar } from '@/components/ui/user-avatar'
import {
  formatRelativeTime,
  formatTime,
  stripMarkdown,
} from '@/features/message/utils/format'
import { useMarkActivityRead } from '@/features/workspace/hooks/use-mark-activity-read'
import type { ActivityItem } from '@/features/workspace/workspace-queries'
import { cn } from '@/lib/utils'

const ACTION: Record<
  ActivityItem['kind'],
  { icon: typeof Reply; label: string }
> = {
  mention: { icon: AtSign, label: 'mentioned you in' },
  'reply-in-thread': { icon: Reply, label: 'replied in a thread you follow' },
  'reply-to-you': { icon: Reply, label: 'replied to your message' },
}

export function ActivityRow({ item }: { item: ActivityItem }) {
  const markActivityRead = useMarkActivityRead()
  const action = ACTION[item.kind]
  const ActionIcon = action.icon
  const href = `/channel/${item.channelId}/thread/${item.messageId}` as Route

  function markRead() {
    if (item.read) {
      return
    }
    markActivityRead.mutate({
      itemIds: [item.id],
      optimistic: 'decrement',
    })
  }

  return (
    <Link
      className={cn(
        'group hover:bg-card dark:hover:bg-card-dark flex gap-3 rounded-xl px-3 py-3',
        !item.read && 'bg-accent-fade/40 dark:bg-accent/5',
      )}
      href={href}
      onClick={markRead}
    >
      <UserAvatar bot={item.actorIsBot} name={item.actor} />
      <div className="min-w-0 flex-1">
        <div className="text-muted dark:text-muted-dark flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.8125rem]">
          <ActionIcon className="text-accent size-3.5" strokeWidth={2} />
          <strong className="font-semibold text-black dark:text-white">
            {item.actor}
          </strong>
          <span>{action.label}</span>
          <span className="inline-flex items-center font-medium text-black/80 dark:text-white/80">
            <Hash className="size-3" strokeWidth={2} />
            {item.channelName}
          </span>
          <span aria-hidden>·</span>
          <time dateTime={item.createdAt} title={formatTime(item.createdAt)}>
            <RelativeTime value={item.createdAt} />
          </time>
        </div>
        <p className="border-divider dark:border-divider-dark mt-2 line-clamp-2 border-l-2 pl-3 text-sm leading-relaxed text-black/75 dark:text-white/75">
          {stripMarkdown(item.preview)}
        </p>
        {item.context ? (
          <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark mt-2 flex items-start gap-1.5 border-l-2 pl-2.5 text-xs">
            <CornerUpLeft className="mt-0.5 size-3 shrink-0" strokeWidth={2} />
            <span className="line-clamp-1">{stripMarkdown(item.context)}</span>
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
  )
}

function RelativeTime({ value }: { value: string }) {
  const [label, setLabel] = useState(() => formatTime(value))

  useEffect(() => {
    function update() {
      setLabel(formatRelativeTime(value))
    }

    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [value])

  return label
}
