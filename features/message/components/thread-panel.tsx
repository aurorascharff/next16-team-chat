'use client'

import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { messageKeys } from '@/features/message/message-cache'
import {
  messagesQueryOptions,
  repliesQueryOptions,
} from '@/features/message/message-query-options'
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
        <button
          aria-label="Close thread"
          className="text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-8 items-center justify-center rounded-lg hover:text-black dark:hover:text-white"
          onClick={closeThread}
          type="button"
        >
          <X aria-hidden className="size-4" strokeWidth={2} />
        </button>
      </header>
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2"
        data-message-scroll
        ref={scrollerRef}
      >
        <div className="flex min-h-full flex-col">
          {children}
          <div className="mt-auto">
            <MessageComposer placeholder="Reply…" />
          </div>
        </div>
      </div>
    </aside>
  )
}

export function ThreadBody({
  channelId,
  messageId,
}: {
  channelId: string
  messageId: string
}) {
  const { data: messages } = useSuspenseQuery(messagesQueryOptions(channelId))
  const { data: replies } = useSuspenseQuery(repliesQueryOptions(messageId))
  const queryClient = useQueryClient()
  const { data: botTyping } = useQuery<{ startedAt: string } | null>({
    enabled: false,
    initialData: null,
    queryKey: messageKeys.botTyping(messageId),
    queryFn: async () => null,
  })
  const parent = messages.find((message) => {
    return message.id === messageId
  })

  useEffect(() => {
    if (!botTyping) return
    const replyArrived = replies.some((reply) => {
      return reply.userId === 'bot' && reply.createdAt >= botTyping.startedAt
    })
    if (replyArrived) {
      queryClient.setQueryData(messageKeys.botTyping(messageId), null)
    }
  }, [botTyping, messageId, queryClient, replies])

  return (
    <>
      {parent ? <MessageRow message={parent} /> : null}
      <div className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark mx-5 my-2 flex items-center gap-3 border-t pt-3 text-xs font-medium">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </div>
      {replies.map((reply) => {
        return <MessageRow key={reply.id} message={reply} />
      })}
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
