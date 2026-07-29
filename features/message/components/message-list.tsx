'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/empty-state'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'

export function MessageList({ channelId }: { channelId: string }) {
  const { data: messages } = useSuspenseQuery(messagesQueryOptions(channelId))

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col overflow-y-auto py-3">
        {messages.length === 0 ? (
          <EmptyState
            body="Start the room with a note, a handoff, or the thing you want reviewed."
            title="No messages yet"
          />
        ) : null}
        {messages.map((message) => {
          return (
            <MessageRow
              key={message.id}
              message={message}
              showThreadAffordance
            />
          )
        })}
      </div>
    </section>
  )
}
