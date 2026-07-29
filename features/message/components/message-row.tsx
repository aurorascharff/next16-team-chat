'use client'

import { Clock, MessageSquare, TriangleAlert } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { Message } from '@/features/message/types/message'
import { cn } from '@/lib/utils'
import { formatInline, formatTime } from './format'
import { useThread } from './thread-context'

export function MessageRow({
  message,
  showThreadAffordance = false,
}: {
  message: Message
  showThreadAffordance?: boolean
}) {
  const { openThread } = useThread()
  const sending = message.status === 'sending'
  const failed = message.status === 'failed'
  const replyCount = message.replyCount ?? 0

  return (
    <article
      className={cn(
        'group relative flex gap-3 px-5 py-1.5 transition-colors',
        sending ? 'opacity-70' : 'hover:bg-card dark:hover:bg-card-dark',
      )}
    >
      <UserAvatar bot={message.userId === 'bot'} name={message.userName} />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
          <strong className="text-[0.9375rem] font-semibold">
            {message.userName}
          </strong>
          {sending ? (
            <span className="text-muted dark:text-muted-dark inline-flex items-center gap-1 text-xs">
              <Clock aria-hidden className="size-3" strokeWidth={2} />
              Sending
            </span>
          ) : failed ? (
            <span className="text-danger inline-flex items-center gap-1 text-xs font-medium">
              <TriangleAlert aria-hidden className="size-3" strokeWidth={2} />
              Not sent
            </span>
          ) : (
            <span className="text-muted dark:text-muted-dark text-xs">
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed break-words text-zinc-800 dark:text-zinc-200">
          {formatInline(message.body)}
        </p>
        {showThreadAffordance && !sending && !failed && replyCount > 0 ? (
          <button
            className="border-divider dark:border-divider-dark hover:border-accent hover:text-accent text-accent mt-1 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold transition-colors"
            onClick={() => {
              return openThread(message.channelId, message.id)
            }}
            type="button"
          >
            <MessageSquare aria-hidden className="size-3.5" strokeWidth={2} />
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </button>
        ) : null}
      </div>
      {showThreadAffordance && !sending && !failed ? (
        <div className="absolute top-1 right-4 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <button
            aria-label="Reply in thread"
            className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-colors"
            onClick={() => {
              return openThread(message.channelId, message.id)
            }}
            type="button"
          >
            <MessageSquare aria-hidden className="size-3.5" strokeWidth={2} />
            Reply
          </button>
        </div>
      ) : null}
    </article>
  )
}
