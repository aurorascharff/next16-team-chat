'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo, type RefObject } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { useChannelReadOnEntry } from '@/features/channel/hooks/use-channel-read'
import { useMessageJump } from '@/features/message/hooks/use-message-jump'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageJumpButton } from './message-jump-button'
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
  const readAtOnEntry = useChannelReadOnEntry(channelId, lastReadAt)

  const unreadMessages = messages.filter((message) => {
    return (
      message.status !== 'sending' &&
      message.status !== 'failed' &&
      message.userId !== currentUserId &&
      (readAtOnEntry ? message.createdAt > readAtOnEntry : true)
    )
  })
  const firstUnreadId = unreadMessages.at(0)?.id
  const unreadCount = unreadMessages.length
  const messageIds = useMemo(() => {
    return messages.map((message) => message.id)
  }, [messages])
  const {
    dismissNewMessages,
    isAtEnd,
    newMessageCount,
    onScroll,
    scrollToEnd,
    unreadMarkerPosition,
    unreadMarkerRef,
    viewportRef,
  } = useMessageJump(messageIds, firstUnreadId)

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

  const showNewMessages = !isAtEnd && newMessageCount > 0
  const showUnreadMessages = unreadCount > 0 && unreadMarkerPosition === 'above'

  return (
    <section aria-label="Messages" className="relative flex min-h-0 flex-1">
      <div
        className="flex flex-1 flex-col-reverse overflow-y-auto py-3"
        onScroll={onScroll}
        ref={viewportRef}
      >
        <div className="flex flex-col">
          {messages.map((message) => {
            return (
              <div key={message.id}>
                {message.id === firstUnreadId ? (
                  <NewMessagesDivider markerRef={unreadMarkerRef} />
                ) : null}
                <MessageRow message={message} showThreadAffordance />
              </div>
            )
          })}
        </div>
      </div>
      {showNewMessages ? (
        <MessageJumpButton
          count={newMessageCount}
          direction="down"
          onDismiss={dismissNewMessages}
          onJump={scrollToEnd}
        />
      ) : null}
      {showUnreadMessages ? (
        <MessageJumpButton
          count={unreadCount}
          direction="up"
          onJump={() => {
            unreadMarkerRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
        />
      ) : null}
    </section>
  )
}

function NewMessagesDivider({
  markerRef,
}: {
  markerRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      className="flex scroll-mt-3 items-center gap-2 px-5 py-1.5"
      ref={markerRef}
    >
      <span className="bg-accent h-px flex-1" />
      <span className="text-accent text-xs font-semibold">New</span>
      <span className="bg-accent h-px flex-1" />
    </div>
  )
}
