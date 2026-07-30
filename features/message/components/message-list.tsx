'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/empty-state'
import { useNewMessageIndicator } from '@/features/message/hooks/use-new-message-indicator'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import { MessageRow } from './message-row'
import { NewMessagesButton, UnreadMessagesButton } from './new-messages-button'

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
  const unreadMarkerRef = useRef<HTMLDivElement | null>(null)
  const [isUnreadMarkerVisible, setIsUnreadMarkerVisible] = useState(true)

  const unreadMessages = lastReadAt
    ? messages.filter((message) => {
        return (
          message.userId !== 'current' &&
          message.userId !== currentUserId &&
          message.userName !== 'You' &&
          message.createdAt > lastReadAt
        )
      })
    : []
  const firstUnreadId = unreadMessages.at(0)?.id
  const hasUnreadMessages = unreadMessages.length > 0
  const showUnreadJump =
    newMessages.isAtEnd && hasUnreadMessages && !isUnreadMarkerVisible
  const showNewMessagesJump = !newMessages.isAtEnd

  useEffect(() => {
    const marker = unreadMarkerRef.current
    const viewport = newMessages.viewportRef.current

    if (!firstUnreadId || !marker || !viewport) {
      setIsUnreadMarkerVisible(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsUnreadMarkerVisible(entry.isIntersecting)
      },
      { root: viewport },
    )

    observer.observe(marker)

    return () => {
      observer.disconnect()
    }
  }, [firstUnreadId, newMessages.viewportRef])

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
                {message.id === firstUnreadId ? (
                  <NewMessagesDivider markerRef={unreadMarkerRef} />
                ) : null}
                <MessageRow message={message} showThreadAffordance />
              </div>
            )
          })}
        </div>
      </div>
      <NewMessagesButton
        count={showNewMessagesJump ? newMessages.count : 0}
        onDismiss={newMessages.dismiss}
        onScrollToEnd={() => {
          newMessages.scrollToEnd()
        }}
      />
      {showUnreadJump ? (
        <UnreadMessagesButton
          count={unreadMessages.length}
          onScrollToUnread={() => {
            unreadMarkerRef.current?.scrollIntoView({
              block: 'start',
              behavior: 'smooth',
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
  markerRef?: RefObject<HTMLDivElement | null>
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
