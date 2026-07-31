'use client'

import useSWR from 'swr'
import type { User } from '@/features/user/types/user'
import { userKeys } from '@/features/user/user-cache'
import { fetchJson } from '@/lib/fetch-json'

export function useUsers() {
  return useSWR<User[]>(userKeys.all, fetchJson, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
}

export function useUserSearch(query: string) {
  return useSWR<User[]>(userKeys.search(query), fetchJson, { suspense: true })
}
