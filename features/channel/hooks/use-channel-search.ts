'use client'

import useSWR from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import { fetchJson } from '@/lib/fetch-json'

export type ChannelSearchItem = {
  id: string
  name: string
  group: string
  isPrivate: boolean
}

export function useChannelSearch(enabled = true) {
  return useSWR<ChannelSearchItem[]>(
    enabled ? channelKeys.all : null,
    fetchJson,
  )
}
