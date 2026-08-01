'use client'

import { useLayoutEffect, useRef } from 'react'

export function usePinnedToBottom() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const isPinned = useRef(true)

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const element = scroller

    function scrollToBottom() {
      element.scrollTop = element.scrollHeight
    }

    function updatePinnedState() {
      isPinned.current =
        element.scrollHeight - element.scrollTop - element.clientHeight < 24
    }

    scrollToBottom()
    const observer = new ResizeObserver(() => {
      if (isPinned.current) scrollToBottom()
    })
    const content = element.firstElementChild
    if (content) observer.observe(content)
    element.addEventListener('scroll', updatePinnedState, { passive: true })

    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', updatePinnedState)
    }
  }, [])

  return scrollerRef
}
