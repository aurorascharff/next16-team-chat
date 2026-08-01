'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'

export function useActivityIndicator(enabled = true) {
  const [mounted, setMounted] = useState(false)
  const { data: activity } = useQuery({
    ...unreadActivityQueryOptions(),
    enabled,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
