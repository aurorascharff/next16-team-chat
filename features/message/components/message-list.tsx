'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/empty-state'
import { useNewMessageIndicator } from '@/features/message/hooks/use-new-message-indicator'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'
import { NewMessagesButton } from './new-messages-button'

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
  const messageIds = messages.map((message) => message.id)
  const newMessages = useNewMessageIndicator(messageIds)

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
          message.userId !== currentUserId &&
          message.userName !== 'You' &&
          message.createdAt > lastReadAt
        )
      })?.id
    : undefined

  return (
    <section aria-label="Messages" className="relative flex min-h-0 flex-1">
      <div
        className="flex-1 overflow-y-auto py-3"
        ref={newMessages.viewportRef}
        onScroll={newMessages.onScroll}
      >
        <div className="flex min-h-full flex-col justify-end">
          {messages.map((message) => {
            return (
              <div key={message.id}>
                {message.id === firstUnreadId ? <NewMessagesDivider /> : null}
                <MessageRow message={message} showThreadAffordance />
              </div>
            )
          })}
        </div>
      </div>
      <NewMessagesButton
        count={newMessages.count}
        onDismiss={newMessages.dismiss}
        onScrollToEnd={() => {
          newMessages.scrollToEnd()
        }}
      />
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
