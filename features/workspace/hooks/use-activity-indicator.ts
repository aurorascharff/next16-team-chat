'use client'

import { useEffect, useState } from 'react'
import { useUnreadActivity } from '@/features/workspace/hooks/use-unread-activity'

export function useActivityIndicator(enabled = true) {
  const [mounted, setMounted] = useState(false)
  const { data: activity } = useUnreadActivity(enabled)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
