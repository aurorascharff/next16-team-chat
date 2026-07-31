'use client'

import useSWR from 'swr'
import { activityKeys } from '@/features/workspace/workspace-cache'
import { fetchJson } from '@/lib/fetch-json'

export type UnreadActivity = { count: number }

export function useUnreadActivity(enabled = true) {
  return useSWR<UnreadActivity>(
    enabled ? activityKeys.unread : null,
    fetchJson,
    {
      refreshInterval: 5_000,
    },
  )
}
