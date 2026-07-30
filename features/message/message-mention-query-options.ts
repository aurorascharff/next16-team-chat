import { queryOptions } from '@tanstack/react-query'
import { apiUrl } from '@/lib/utils'

export const mentionKeys = {
  unread: ['mentions', 'unread'] as const,
}

export function unreadMentionsQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<{ count: number }> => {
      const res = await fetch(apiUrl('/api/mentions/unread'))

      if (!res.ok) {
        throw new Error('Failed to fetch mentions')
      }

      return res.json()
    },
    queryKey: mentionKeys.unread,
    refetchInterval: 5_000,
    staleTime: 15_000,
  })
}
