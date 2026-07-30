'use client'

import {
  Check,
  Clock,
  Link2,
  MessageSquare,
  RotateCw,
  TriangleAlert,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useSendMessage } from '@/features/message/message-mutations'
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
  const sendMessage = useSendMessage({
    channelId: message.channelId,
    parentId: message.parentId ?? undefined,
  })
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
            <span className="text-danger inline-flex items-center gap-1.5 text-xs font-medium">
              <TriangleAlert aria-hidden className="size-3" strokeWidth={2} />
              Not sent
              <button
                className="text-danger hover:text-danger/80 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                onClick={() => {
                  return sendMessage.mutate(message)
                }}
                type="button"
              >
                <RotateCw aria-hidden className="size-3" strokeWidth={2} />
                Retry
              </button>
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
        {!sending && !failed ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <MessageReactions message={message} />
            <AddReaction message={message} />
            {showThreadAffordance ? (
              <button
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-colors',
                  replyCount > 0
                    ? 'border-accent/30 bg-accent-fade text-accent hover:border-accent/60'
                    : 'border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark text-muted dark:text-muted-dark hover:border-accent hover:text-accent opacity-0 group-hover:opacity-100',
                )}
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
                {replyCount > 0
                  ? `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
                  : 'Reply'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {!sending && !failed ? (
        <div className="absolute top-1 right-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            aria-label="Copy link to message"
            className={cn(
              'border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark flex size-7 items-center justify-center rounded-md border shadow-sm transition-colors',
              copied
                ? 'border-success text-success'
                : 'text-muted dark:text-muted-dark hover:border-accent hover:text-accent',
            )}
            onClick={copyLink}
            title={copied ? 'Copied!' : 'Copy link'}
            type="button"
          >
            {copied ? (
              <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Link2 aria-hidden className="size-3.5" strokeWidth={2} />
            )}
          </button>
        </div>
      ) : null}
    </article>
  )
}
