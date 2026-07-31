'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type UIEvent,
} from 'react'

const END_THRESHOLD = 8

export function useMessageJump(
  messageIds: string[],
  unreadMarkerId: string | undefined,
) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const unreadMarkerRef = useRef<HTMLDivElement>(null)
  const previousLastMessageId = useRef<string | null>(null)
  const [isUnreadMarkerVisible, setIsUnreadMarkerVisible] = useState(true)
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [isAtEnd, setIsAtEnd] = useState(true)
  const lastMessageId = messageIds.at(-1) ?? null

  function isViewportAtEnd(viewport: HTMLDivElement) {
    return Math.abs(viewport.scrollTop) < END_THRESHOLD
  }

  function dismissNewMessages() {
    setNewMessageCount(0)
  }

  function scrollToEnd(behavior: ScrollBehavior = 'smooth') {
    viewportRef.current?.scrollTo({ behavior, top: 0 })
    setIsAtEnd(true)
    dismissNewMessages()
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const atEnd = isViewportAtEnd(event.currentTarget)
    setIsAtEnd(atEnd)
    if (atEnd) dismissNewMessages()
  }

  useLayoutEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 })
    previousLastMessageId.current = lastMessageId
    setNewMessageCount(0)
    setIsAtEnd(true)
  }, [])

  useEffect(() => {
    if (!lastMessageId) {
      previousLastMessageId.current = null
      setNewMessageCount(0)
      return
    }

    const previous = previousLastMessageId.current
    previousLastMessageId.current = lastMessageId

    if (!previous || previous === lastMessageId) return

    const viewport = viewportRef.current
    if (!viewport || isViewportAtEnd(viewport)) {
      scrollToEnd('auto')
      return
    }

    const previousIndex = messageIds.indexOf(previous)
    const appendedCount =
      previousIndex === -1 ? 1 : messageIds.length - previousIndex - 1

    setNewMessageCount((count) => {
      return count + Math.max(appendedCount, 1)
    })
  }, [lastMessageId, messageIds.length])

  useEffect(() => {
    const marker = unreadMarkerRef.current
    const viewport = viewportRef.current

    if (!unreadMarkerId || !marker || !viewport) {
      setIsUnreadMarkerVisible(true)
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
  }, [unreadMarkerId])

  return {
    dismissNewMessages,
    isAtEnd,
    isUnreadMarkerVisible,
    newMessageCount,
    onScroll,
    scrollToEnd,
    unreadMarkerRef,
    viewportRef,
  }
}
