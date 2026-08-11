'use client'

import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Boundary } from '@/components/internal/boundary'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 280
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 320

export function ResizablePanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

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
  }

  function startDragging() {
    setDragging(true)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', stopDragging, { once: true })
  }

  return (
    <Boundary label="ResizablePanel" asChild>
      <div
        className={cn(
          'relative hidden min-h-0 shrink-0 overflow-hidden lg:block lg:h-full lg:w-[var(--panel-width)]',
          className,
        )}
        data-boundary-label-inside
        ref={panelRef}
        style={{ '--panel-width': `${width}px` } as CSSProperties}
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
    </Boundary>
  )
}
