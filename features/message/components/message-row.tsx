'use client'

import { Clock, Link2, MessageSquare, TriangleAlert } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { Message } from '@/features/message/types/message'
import { useValidMentions } from '@/features/user/use-valid-mentions'
import { cn } from '@/lib/utils'
import { formatMarkdown, formatTime } from './format'
import { AddReaction, MessageReactions } from './message-reactions'
import { useThread } from './use-thread'

export function MessageRow({
  message,
  showThreadAffordance = false,
}: {
  message: Message
  showThreadAffordance?: boolean
}) {
  const { openThread } = useThread()
  const validMentions = useValidMentions()
  const searchParams = useSearchParams()
  const articleRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const sending = message.status === 'sending'
  const failed = message.status === 'failed'
  const replyCount = message.replyCount ?? 0
  const linked = searchParams.get('message') === message.id

  useEffect(() => {
    if (!linked) return
    const el = articleRef.current
    if (!el) return
    el.scrollIntoView({ block: 'center' })
    el.classList.remove('message-highlight')
    void el.offsetWidth
    el.classList.add('message-highlight')
  }, [linked])

  async function copyLink() {
    const url = `${window.location.origin}/channel/${message.channelId}?message=${message.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article
      className={cn(
        'group relative flex gap-3 px-5 py-1.5 transition-colors',
        sending ? 'opacity-70' : 'hover:bg-card dark:hover:bg-card-dark',
      )}
      id={`message-${message.id}`}
      ref={articleRef}
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
        <div className="max-w-3xl space-y-2 text-[0.9375rem] leading-relaxed break-words text-zinc-800 dark:text-zinc-200">
          {formatMarkdown(message.body, validMentions)}
        </div>
        {!sending &&
        !failed &&
        (message.reactions?.length ||
          (showThreadAffordance && replyCount > 0)) ? (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <MessageReactions message={message} />
            {showThreadAffordance && replyCount > 0 ? (
              <button
                className="border-divider dark:border-divider-dark hover:border-accent hover:text-accent text-accent flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold transition-colors"
                onClick={() => {
                  return openThread(message.channelId, message.id)
                }}
                type="button"
              >
                <MessageSquare
                  aria-hidden
                  className="size-3.5"
                  strokeWidth={2}
                />
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {!sending && !failed ? (
        <div className="absolute top-1 right-4 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <AddReaction message={message} />
          <button
            aria-label="Copy link to message"
            className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent flex size-7 items-center justify-center rounded-md border shadow-sm transition-colors"
            onClick={copyLink}
            title={copied ? 'Copied!' : 'Copy link'}
            type="button"
          >
            <Link2 aria-hidden className="size-3.5" strokeWidth={2} />
          </button>
          {showThreadAffordance && replyCount === 0 ? (
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
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
