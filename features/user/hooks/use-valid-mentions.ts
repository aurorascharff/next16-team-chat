'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { usersQueryOptions } from '@/features/user/hooks/user-query-options'

export function useValidMentions() {
  const { data: users } = useQuery(usersQueryOptions())
  return useMemo(() => {
    if (!users) return undefined
    return new Set(
      users.flatMap((user) => [
        user.name.toLowerCase(),
        user.handle.toLowerCase(),
      ]),
    )
  }, [users])
}
