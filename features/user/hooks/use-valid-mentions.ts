'use client'

import { useMemo } from 'react'
import { useUsers } from '@/features/user/hooks/use-users'

export function useValidMentions() {
  const { data: users } = useUsers()
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
