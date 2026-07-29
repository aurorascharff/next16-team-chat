'use client'

import { useEffect } from 'react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  messageKeys,
  messagesQueryOptions,
} from '@/features/message/message-query-options'
import type { Message } from '@/features/message/message-types'

const incomingBodies = [
  'I added the screenshot to the thread.',
  'The preview looks good on mobile now.',
  'One more pass on empty states and we can ship.',
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function LiveMessageTicker({ channelId }: { channelId: string }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    let index = 0
    const interval = window.setInterval(() => {
      const message: Message = {
        body: incomingBodies[index % incomingBodies.length],
        channelId,
        createdAt: new Date().toISOString(),
        id: `local-${channelId}-${Date.now()}`,
        userId: 'nova',
        userName: 'Nova',
      }

      queryClient.setQueryData<Message[]>(
        messageKeys.channel(channelId),
        (current = []) => [...current, message],
      )
      index += 1
    }, 12_000)

    return () => window.clearInterval(interval)
  }, [channelId, queryClient])

  return null
}

export function MessageList({ channelId }: { channelId: string }) {
  const { data: messages, isFetching } = useSuspenseQuery(
    messagesQueryOptions(channelId),
  )

  return (
    <section className="message-list" aria-label="Messages">
      <LiveMessageTicker channelId={channelId} />
      <div className="sync-pill" data-active={isFetching}>
        {isFetching ? 'Syncing' : 'Live'}
      </div>
      {messages.map((message) => (
        <article className="message-row" key={message.id}>
          <div className="avatar" aria-hidden>
            {initials(message.userName)}
          </div>
          <div className="message-copy">
            <div className="message-meta">
              <strong>{message.userName}</strong>
              <span>{formatTime(message.createdAt)}</span>
              {message.optimistic ? <em>Sending…</em> : null}
            </div>
            <p>{message.body}</p>
          </div>
        </article>
      ))}
    </section>
  )
}
