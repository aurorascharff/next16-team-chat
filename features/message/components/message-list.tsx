'use client'

import type { RefObject } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { useChannelReadOnEntry } from '@/features/channel/hooks/use-channel-read'
import { useMessageJump } from '@/features/message/hooks/use-message-jump'
import { useSuspenseMessages } from '@/features/message/hooks/use-messages'
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
  const { data: messages = [] } = useSuspenseMessages(channelId)
  const readAtOnEntry = useChannelReadOnEntry(channelId, lastReadAt)

  const unreadMessages = messages.filter((message) => {
    return (
      message.userId !== currentUserId &&
      (readAtOnEntry ? message.createdAt > readAtOnEntry : true)
    )
  })
  const firstUnreadId = unreadMessages.at(0)?.id
  const unreadCount = unreadMessages.length
  const messageJump = useMessageJump(
    messages.map((message) => message.id),
    firstUnreadId,
  )

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

  const showNewMessages =
    !messageJump.isAtEnd && messageJump.newMessageCount > 0
  const showUnreadMessages =
    messageJump.isAtEnd && unreadCount > 0 && !messageJump.isUnreadMarkerVisible

  return (
    <section aria-label="Messages" className="relative flex min-h-0 flex-1">
      <div
        className="flex flex-1 flex-col-reverse overflow-y-auto py-3"
        onScroll={messageJump.onScroll}
        ref={messageJump.viewportRef}
      >
        <div className="flex flex-col">
          {messages.map((message) => {
            return (
              <div key={message.id}>
                {message.id === firstUnreadId ? (
                  <NewMessagesDivider markerRef={messageJump.unreadMarkerRef} />
                ) : null}
                <MessageRow message={message} showThreadAffordance />
              </div>
            )
          })}
        </div>
      </div>
      {showNewMessages ? (
        <MessageJumpButton
          count={messageJump.newMessageCount}
          direction="down"
          onDismiss={messageJump.dismissNewMessages}
          onJump={messageJump.scrollToEnd}
        />
      ) : null}
      {showUnreadMessages ? (
        <MessageJumpButton
          count={unreadCount}
          direction="up"
          onJump={() => {
            messageJump.unreadMarkerRef.current?.scrollIntoView({
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
