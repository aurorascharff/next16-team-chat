'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 280
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 320
const STORAGE_KEY = 'huddle:sidebar-width'

export function ResizablePanel({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY))
    if (stored >= MIN_WIDTH && stored <= MAX_WIDTH) {
      setWidth(stored)
    }
  }, [])

  function onPointerMove(event: PointerEvent) {
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    const next = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, rect.right - event.clientX),
    )
    setWidth(next)
  }

  function stopDragging() {
    setDragging(false)
    document.removeEventListener('pointermove', onPointerMove)
    setWidth((current) => {
      localStorage.setItem(STORAGE_KEY, String(current))
      return current
    })
  }

  function startDragging() {
    setDragging(true)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', stopDragging, { once: true })
  }

  return (
    <div
      className="relative hidden shrink-0 lg:block"
      ref={panelRef}
      style={{ width }}
    >
      <button
        aria-label="Resize panel"
        className={cn(
          'absolute top-0 left-0 z-10 h-full w-1 -translate-x-1/2 cursor-col-resize',
          'before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-transparent',
          'hover:before:bg-accent',
          dragging && 'before:bg-accent',
        )}
        onPointerDown={(event) => {
          event.preventDefault()
          startDragging()
        }}
        type="button"
      />
      {children}
    </div>
  )
}
