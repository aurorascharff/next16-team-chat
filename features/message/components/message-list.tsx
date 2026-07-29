'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import {
  flattenMessages,
  messagesInfiniteQueryOptions,
} from '@/features/message/message-query-options'
import { MessageRow } from './message-row'

export function MessageList({ channelId }: { channelId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(channelId))
  const messages = flattenMessages(data)

  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [channelId])

  return (
    <section
      aria-label="Messages"
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div
        className="flex flex-1 flex-col overflow-y-auto py-3"
        ref={scrollRef}
      >
        {hasNextPage ? (
          <div className="flex justify-center py-2">
            <button
              className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-progress disabled:opacity-60"
              disabled={isFetchingNextPage}
              onClick={() => {
                return fetchNextPage()
              }}
              type="button"
            >
              {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
            </button>
          </div>
        ) : null}
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
