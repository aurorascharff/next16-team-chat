'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/empty-state'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'

export function MessageList({
  channelId,
  lastReadAt,
}: {
  channelId: string
  lastReadAt: string | null
}) {
  const { data: messages } = useSuspenseQuery(messagesQueryOptions(channelId))

  if (messages.length === 0) {
    return (
      <section
        aria-label="Messages"
        className="flex flex-1 flex-col overflow-y-auto py-3"
      >
        <EmptyState
          body="Start the room with a note, a handoff, or the thing you want reviewed."
          title="No messages yet"
        />
      </section>
    )
  }

  const firstUnreadId = lastReadAt
    ? messages.find((message) => {
        return (
          message.userId !== 'current' &&
          message.userName !== 'You' &&
          message.createdAt > lastReadAt
        )
      })?.id
    : undefined

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col-reverse overflow-y-auto py-3"
    >
      <div className="flex flex-col">
        {messages.map((message) => {
          return (
            <div key={message.id}>
              {message.id === firstUnreadId ? <NewMessagesDivider /> : null}
              <MessageRow message={message} showThreadAffordance />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function NewMessagesDivider() {
  return (
    <div className="flex items-center gap-2 px-5 py-1.5">
      <span className="bg-accent h-px flex-1" />
      <span className="text-accent text-xs font-semibold">New</span>
      <span className="bg-accent h-px flex-1" />
    </div>
  )
}
