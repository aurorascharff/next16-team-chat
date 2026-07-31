'use client'

import useSWR from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import { fetchJson } from '@/lib/fetch-json'

export type UnreadChannels = Record<string, number>

export function useUnreadChannels(enabled = true) {
  return useSWR<UnreadChannels>(
    enabled ? channelKeys.unread : null,
    fetchJson,
    {
      refreshInterval: 5_000,
    },
  )
}
