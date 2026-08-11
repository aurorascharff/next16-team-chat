'use client'

import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Boundary } from '@/components/internal/boundary'
import { IconButton } from '@/components/ui/icon-button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { messageKeys } from '@/features/message/message-cache'
import {
  useSuspenseMessages,
  useSuspenseReplies,
} from '@/features/message/hooks/use-messages'
import { MessageComposer } from './message-composer'
import { MessageRow } from './message-row'
import { useThread } from '@/features/message/hooks/use-thread'
import { usePinnedToBottom } from '@/features/message/hooks/use-pinned-to-bottom'

export function ThreadPanel({
  children,
  subtitle,
}: {
  children: ReactNode
  subtitle: ReactNode
}) {
  const { closeThread } = useThread()
  const scrollerRef = usePinnedToBottom()

  return (
    <Boundary label="ThreadPanel" asChild>
      <aside
        aria-label="Thread"
        className="border-divider dark:border-divider-dark flex h-full min-h-0 flex-col border-l"
      >
        <header
          className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark flex items-center justify-between border-b px-4 py-3"
          style={{ viewTransitionName: 'thread-header' }}
        >
          <h2 className="flex min-w-0 items-center gap-1.5">
            <span>Thread</span>
            {subtitle}
          </h2>
          <IconButton label="Close thread" onClick={closeThread}>
            <X aria-hidden className="size-4" strokeWidth={2} />
          </IconButton>
        </header>
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2"
          data-message-scroll
          ref={scrollerRef}
        >
          <div className="flex min-h-full flex-col">
            {children}
            <div className="mt-auto">
              <MessageComposer placeholder="Reply…" thread />
            </div>
          </div>
        </div>
      </aside>
    </Boundary>
  )
}

export function ThreadBody({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const { data: messages = [] } = useSuspenseMessages(channelId)
  const { data: replies = [] } = useSuspenseReplies(messageId)
  const { mutate } = useSWRConfig()
  const { data: botTyping } = useSWR<{ startedAt: string } | null>(
    messageKeys.botTyping(messageId),
    null,
    { fallbackData: null },
  )
  const parent = messages.find((message) => message.id === messageId)

  useEffect(() => {
    if (!botTyping) return
    const replyArrived = replies.some((reply) => {
      return reply.userId === 'bot' && reply.createdAt >= botTyping.startedAt
    })
    if (replyArrived) {
      void mutate(messageKeys.botTyping(messageId), null, false)
    }
  }, [botTyping, messageId, mutate, replies])

  return (
    <>
      {parent ? <MessageRow message={parent} /> : null}
      <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark mx-5 my-2 flex items-center gap-3 border-t pt-3 text-xs font-medium">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </div>
      {replies.map((reply) => (
        <MessageRow key={reply.id} message={reply} />
      ))}
      {botTyping ? <BotTypingIndicator /> : null}
    </>
  )
}

function BotTypingIndicator() {
  return (
    <div
      aria-label="Huddle Bot is thinking"
      className="flex gap-3 px-5 py-2"
      role="status"
    >
      <UserAvatar bot name="Huddle Bot" />
      <div className="min-w-0 pt-0.5">
        <strong className="text-[0.9375rem] font-semibold">Huddle Bot</strong>
        <p className="typing-shimmer mt-1 text-sm font-medium">Typing...</p>
      </div>
    </div>
  )
}
