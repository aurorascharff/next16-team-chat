'use client'

import {
  Check,
  Clock,
  Link2,
  MessageSquare,
  RotateCw,
  TriangleAlert,
} from 'lucide-react'
import type { Route } from 'next'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Boundary } from '@/components/internal/boundary'
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link'
import { IconButton } from '@/components/ui/icon-button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useSendMessage } from '@/features/message/hooks/use-message-mutations'
import type { Message } from '@/features/message/types/message'
import { useValidMentions } from '@/features/user/hooks/use-valid-mentions'
import { cn } from '@/lib/utils'
import { formatMarkdown, formatTime } from '@/features/message/utils/format'
import { AddReaction, MessageReactions } from './message-reactions'

export function MessageRow({
  message,
  showThreadAffordance = false,
}: {
  message: Message
  showThreadAffordance?: boolean
}) {
  const validMentions = useValidMentions()
  const searchParams = useSearchParams()
  const sendMessage = useSendMessage()
  const articleRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const sending = message.status === 'sending'
  const failed = message.status === 'failed'
  const replyCount = message.replyCount ?? 0
  const linked = searchParams.get('message') === message.id
  const threadHref =
    `/channel/${message.channelId}/thread/${message.id}` as Route

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
    <Boundary label="MessageRow" asChild>
      <article
        className={cn(
          'group relative flex gap-3 px-5 py-1.5',
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
                    return sendMessage.mutate({
                      channelId: message.channelId,
                      message,
                      parentId: message.parentId ?? undefined,
                    })
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
          {!sending && !failed && message.reactions?.length ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <MessageReactions message={message} />
            </div>
          ) : null}
          {!sending && !failed && showThreadAffordance && replyCount > 0 ? (
            <HoverPrefetchLink
              className="text-accent hover:bg-accent-fade border-accent/20 hover:border-accent/30 -mx-1 mt-1.5 inline-flex w-fit items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-xs font-semibold transition-colors"
              href={threadHref}
            >
              <MessageSquare aria-hidden className="size-3.5" strokeWidth={2} />
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </HoverPrefetchLink>
          ) : null}
        </div>
        {!sending && !failed ? (
          <div className="border-divider dark:border-divider-dark bg-surface dark:bg-elevated-dark absolute top-2 right-4 flex items-center gap-0.5 rounded-lg border p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <AddReaction message={message} />
            {showThreadAffordance ? (
              <HoverPrefetchLink
                aria-label="Reply in thread"
                className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark hover:text-accent flex size-7 items-center justify-center rounded-md transition-colors"
                href={threadHref}
                title="Reply in thread"
              >
                <MessageSquare
                  aria-hidden
                  className="size-3.5"
                  strokeWidth={2}
                />
              </HoverPrefetchLink>
            ) : null}
            <IconButton
              className={cn(
                copied &&
                  'text-success hover:text-success hover:bg-transparent',
                !copied && 'hover:text-accent dark:hover:text-accent',
              )}
              label="Copy link to message"
              onClick={copyLink}
              size="sm"
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? (
                <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
              ) : (
                <Link2 aria-hidden className="size-3.5" strokeWidth={2} />
              )}
            </IconButton>
          </div>
        ) : null}
      </article>
    </Boundary>
  )
}
