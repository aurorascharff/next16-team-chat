'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { activityKeys } from '@/features/workspace/workspace-cache'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'

export function useActivityIndicator(enabled = true) {
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const { data: activity } = useQuery({
    ...unreadActivityQueryOptions(),
    enabled,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    clearActivity() {
      queryClient.setQueryData(activityKeys.unread, { count: 0 })
    },
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
