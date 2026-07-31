'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { useChannelReadOnEntry } from '@/features/channel/hooks/use-channel-read'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'

export function MessageList({
  channelId,
  currentUserId,
  lastReadAt,
}: {
  channelId: string
  currentUserId: string
  lastReadAt: string | null
}) {
  const { data: messages } = useSuspenseQuery(messagesQueryOptions(channelId))
  const viewportRef = useRef<HTMLElement>(null)
  const readAtOnEntry = useChannelReadOnEntry(channelId, lastReadAt)

  useLayoutEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 })
  }, [])

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

  const firstUnreadId = messages.find((message) => {
    if (message.userId === currentUserId) {
      return false
    }

    return readAtOnEntry ? message.createdAt > readAtOnEntry : true
  })?.id

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col-reverse overflow-y-auto py-3"
      ref={viewportRef}
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
