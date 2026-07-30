'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { activityKeys } from '@/features/workspace/workspace-query-options'
import { ACTIVITY_READ_DIRTY_KEY } from './activity-read-navigation-refresh'

export function MarkActivityRead({ itemIds }: { itemIds: string[] }) {
  const queryClient = useQueryClient()
  const lastKey = useRef('')
  const key = itemIds.join(':')

  useEffect(() => {
    if (itemIds.length === 0 || lastKey.current === key) {
      return
    }

    lastKey.current = key
    sessionStorage.setItem(ACTIVITY_READ_DIRTY_KEY, '1')
    queryClient.setQueryData<{ count: number }>(activityKeys.unread, {
      count: 0,
    })
    void fetch('/api/activity/read', {
      body: JSON.stringify({ itemIds }),
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      method: 'POST',
    }).catch(() => {
      queryClient.invalidateQueries({ queryKey: activityKeys.unread })
    })
  }, [itemIds, key, queryClient])

  return null
}
