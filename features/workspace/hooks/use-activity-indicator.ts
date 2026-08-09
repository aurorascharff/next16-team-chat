'use client'

import { useQuery } from '@tanstack/react-query'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'
import { useIsMounted } from '@/lib/use-is-mounted'

export function useActivityIndicator(enabled = true) {
  const mounted = useIsMounted()
  const { data: activity } = useQuery({
    ...unreadActivityQueryOptions(),
    enabled,
  })

  return {
    hasActivity: mounted && Boolean(activity && activity.count > 0),
  }
}
