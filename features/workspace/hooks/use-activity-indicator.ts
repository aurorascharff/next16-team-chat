'use client'

import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { activityKeys } from '@/features/workspace/workspace-cache'
import { useUnreadActivity } from '@/features/workspace/hooks/use-unread-activity'

export function useActivityIndicator(enabled = true) {
  const { mutate } = useSWRConfig()
  const [mounted, setMounted] = useState(false)
  const { data: activity } = useUnreadActivity(enabled)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    clearActivity() {
      void mutate(activityKeys.unread, { count: 0 }, { revalidate: false })
    },
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
