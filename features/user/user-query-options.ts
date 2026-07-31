import { queryOptions } from '@tanstack/react-query'
import type { User } from '@/features/user/types/user'
import { apiUrl } from '@/lib/utils'

export const userKeys = {
  all: ['users'] as const,
  search: (query: string) => ['users', 'search', query] as const,
}

export function usersQueryOptions() {
  return queryOptions({
    queryFn: async (): Promise<User[]> => {
      const res = await fetch(apiUrl('/api/users'))
      if (!res.ok) throw new Error('Failed to load users')
      return res.json()
    },
    queryKey: userKeys.all,
    staleTime: Infinity,
  })
}

export function userSearchQueryOptions(query: string) {
  return queryOptions({
    queryFn: async (): Promise<User[]> => {
      const res = await fetch(
        apiUrl(`/api/users?q=${encodeURIComponent(query)}`),
      )
      if (!res.ok) throw new Error('Failed to search users')
      return res.json()
    },
    queryKey: userKeys.search(query),
  })
}
