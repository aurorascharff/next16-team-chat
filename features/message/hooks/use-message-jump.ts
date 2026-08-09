'use client'

import {
  useCallback,
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
  const didInitialScroll = useRef(false)
  const [unreadMarkerPosition, setUnreadMarkerPosition] = useState<
    'above' | 'visible' | 'below'
  >('visible')
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [isAtEnd, setIsAtEnd] = useState(true)
  const lastMessageId = messageIds.at(-1) ?? null

  const isViewportAtEnd = useCallback((viewport: HTMLDivElement) => {
    return Math.abs(viewport.scrollTop) < END_THRESHOLD
  }, [])

  const dismissNewMessages = useCallback(() => {
    setNewMessageCount(0)
  }, [])

  const scrollToEnd = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      viewportRef.current?.scrollTo({ behavior, top: 0 })
      setIsAtEnd(true)
      dismissNewMessages()
    },
    [dismissNewMessages],
  )

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const atEnd = isViewportAtEnd(event.currentTarget)
      setIsAtEnd(atEnd)
      if (atEnd) dismissNewMessages()
    },
    [dismissNewMessages, isViewportAtEnd],
  )

  useLayoutEffect(() => {
    if (didInitialScroll.current) return
    didInitialScroll.current = true
    viewportRef.current?.scrollTo({ top: 0 })
    previousLastMessageId.current = lastMessageId
  }, [lastMessageId])

  useEffect(() => {
    if (!lastMessageId) {
      previousLastMessageId.current = null
      queueMicrotask(() => setNewMessageCount(0))
      return
    }

    const previous = previousLastMessageId.current
    previousLastMessageId.current = lastMessageId

    if (!previous || previous === lastMessageId) return

    const viewport = viewportRef.current
    if (!viewport || isViewportAtEnd(viewport)) {
      viewport?.scrollTo({ top: 0 })
      queueMicrotask(() => {
        setIsAtEnd(true)
        setNewMessageCount(0)
      })
      return
    }

    const previousIndex = messageIds.indexOf(previous)
    const appendedCount =
      previousIndex === -1 ? 1 : messageIds.length - previousIndex - 1

    queueMicrotask(() => {
      setNewMessageCount((count) => {
        return count + Math.max(appendedCount, 1)
      })
    })
  }, [isViewportAtEnd, lastMessageId, messageIds])

  useEffect(() => {
    const marker = unreadMarkerRef.current
    const viewport = viewportRef.current

    if (!unreadMarkerId || !marker || !viewport) {
      setUnreadMarkerPosition('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUnreadMarkerPosition('visible')
          return
        }

        const viewportTop = entry.rootBounds?.top ?? 0
        setUnreadMarkerPosition(
          entry.boundingClientRect.bottom <= viewportTop ? 'above' : 'below',
        )
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
    unreadMarkerPosition,
    newMessageCount,
    onScroll,
    scrollToEnd,
    unreadMarkerRef,
    viewportRef,
  }
}
