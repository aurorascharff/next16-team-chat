import { queryOptions } from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'
import { activityKeys } from './workspace-cache'

export function unreadActivityQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<{ count: number }> => {
      const res = await fetch(apiUrl('/api/activity/unread'))

      if (!res.ok) {
        throw new Error('Failed to fetch activity')
      }

      return res.json()
    },
    queryKey: activityKeys.unread,
    refetchInterval: 5_000,
  })
}
