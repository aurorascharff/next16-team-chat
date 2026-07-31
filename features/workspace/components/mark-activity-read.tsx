'use client'

import { useEffect, useRef } from 'react'
import { useMarkActivityRead } from '@/features/workspace/hooks/use-mark-activity-read'

export function MarkActivityRead({ itemIds }: { itemIds: string[] }) {
  const markRead = useMarkActivityRead()
  const lastKey = useRef('')
  const key = itemIds.join(':')

  useEffect(() => {
    if (itemIds.length === 0 || lastKey.current === key) {
      return
    }

    lastKey.current = key
    markRead.mutate({
      itemIds,
      optimistic: 'clear',
    })
  }, [itemIds, key, markRead])

  return null
}
