'use client'

import { useLayoutEffect, useRef, useState, type UIEvent } from 'react'

export function useNewMessageIndicator(messageIds: string[], resetKey: string) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const previousLastMessageId = useRef<string | null>(null)
  const previousResetKey = useRef(resetKey)
  const messageIdsRef = useRef(messageIds)
  const [count, setCount] = useState(0)
  const [isAtEnd, setIsAtEnd] = useState(true)

  messageIdsRef.current = messageIds

  const lastMessageId = messageIds.at(-1) ?? null

  function isViewportAtEnd(viewport: HTMLDivElement) {
    const distanceFromEnd =
      viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
    return distanceFromEnd < 8
  }

  function dismiss() {
    previousLastMessageId.current = lastMessageId
    setCount(0)
  }

  function scrollToEnd(behavior: ScrollBehavior = 'smooth') {
    const viewport = viewportRef.current
    if (!viewport) return

    viewport.scrollTo({ behavior, top: viewport.scrollHeight })
    setIsAtEnd(true)
    dismiss()
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const atEnd = isViewportAtEnd(event.currentTarget)
    setIsAtEnd(atEnd)

    if (atEnd) {
      dismiss()
    }
  }

  useLayoutEffect(() => {
    if (previousResetKey.current === resetKey) return

    previousResetKey.current = resetKey
    previousLastMessageId.current = lastMessageId
    setCount(0)
    setIsAtEnd(true)

    const viewport = viewportRef.current
    if (!viewport) return

    viewport.scrollTo({ behavior: 'auto', top: viewport.scrollHeight })
  }, [lastMessageId, resetKey])

  useLayoutEffect(() => {
    if (!lastMessageId) {
      previousLastMessageId.current = null
      setCount(0)
      return
    }

    const previous = previousLastMessageId.current

    if (previous === null) {
      previousLastMessageId.current = lastMessageId
      scrollToEnd('auto')
      return
    }

    if (previous === lastMessageId) return

    previousLastMessageId.current = lastMessageId

    const viewport = viewportRef.current
    if (!viewport || isViewportAtEnd(viewport)) {
      scrollToEnd('auto')
      return
    }

    const currentIds = messageIdsRef.current
    const previousIndex = currentIds.indexOf(previous)
    const appendedCount =
      previousIndex === -1 ? 1 : currentIds.length - previousIndex - 1

    setCount((value) => value + Math.max(appendedCount, 1))
  }, [lastMessageId, messageIds.length])

  return {
    count,
    dismiss,
    isAtEnd,
    onScroll,
    scrollToEnd,
    viewportRef,
  }
}
