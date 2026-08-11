'use client'

import useSWR from 'swr'
import { messageKeys } from '@/features/message/message-cache'
import type { Message } from '@/features/message/types/message'
import { fetchJson } from '@/lib/fetch-json'

export function useMessages(channelId: string | null, enabled = true) {
  return useSWR<Message[]>(
    enabled && channelId ? messageKeys.channel(channelId) : null,
    fetchJson,
    {
      refreshInterval: 10_000,
      revalidateOnMount: true,
    },
  )
}

export function useSuspenseMessages(channelId: string) {
  return useSWR<Message[]>(messageKeys.channel(channelId), fetchJson, {
    refreshInterval: 10_000,
    revalidateOnMount: false,
    suspense: true,
  })
}

export function useSuspenseReplies(messageId: string) {
  return useSWR<Message[]>(messageKeys.replies(messageId), fetchJson, {
    refreshInterval: 10_000,
    revalidateOnMount: false,
    suspense: true,
  })
}
