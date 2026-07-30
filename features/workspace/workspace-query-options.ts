import { queryOptions } from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'

export const activityKeys = {
  unread: ['activity', 'unread'] as const,
}

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
    staleTime: 15_000,
  })
}
