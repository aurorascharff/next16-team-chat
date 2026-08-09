'use client'

import { useUnreadActivity } from '@/features/workspace/hooks/use-unread-activity'
import { useIsMounted } from '@/lib/use-is-mounted'

export function useActivityIndicator(enabled = true) {
  const mounted = useIsMounted()
  const { data: activity } = useUnreadActivity(enabled)

  return {
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
