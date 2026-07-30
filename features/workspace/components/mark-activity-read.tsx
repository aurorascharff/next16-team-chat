'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { activityKeys } from '@/features/workspace/workspace-query-options'

export function MarkActivityRead({ itemIds }: { itemIds: string[] }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const lastKey = useRef('')
  const refreshOnLeave = useRef(false)
  const key = itemIds.join(':')

  useEffect(() => {
    return () => {
      if (refreshOnLeave.current) {
        router.refresh()
      }
    }
  }, [router])

  useEffect(() => {
    if (itemIds.length === 0 || lastKey.current === key) {
      return
    }

    lastKey.current = key
    refreshOnLeave.current = true
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
