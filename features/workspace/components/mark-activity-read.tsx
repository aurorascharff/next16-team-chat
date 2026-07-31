'use client'

import { useEffect, useEffectEvent, useRef } from 'react'
import { useMarkActivityRead } from '@/features/workspace/hooks/use-mark-activity-read'

export function MarkActivityRead({ itemIds }: { itemIds: string[] }) {
  const markRead = useEffectEvent(useMarkActivityRead())
  const lastKey = useRef('')
  const key = itemIds.join(':')

  useEffect(() => {
    if (itemIds.length === 0 || lastKey.current === key) {
      return
    }

    lastKey.current = key
    void markRead({
      itemIds,
      optimistic: 'clear',
    })
  }, [itemIds, key])

  return null
}
