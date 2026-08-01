'use client'

import useSWR from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import type { ChannelSearchItem } from '@/features/channel/hooks/use-channel-search'
import { messageKeys } from '@/features/message/message-cache'
import type { Message } from '@/features/message/types/message'
import { fetchJson } from '@/lib/fetch-json'

export function useCommandPaletteResults(query: string) {
  const messagesKey = messageKeys.workspaceSearch(query)

  return useSWR(
    channelKeys.commandPalette(query, messagesKey),
    async ([, channelsUrl, messagesUrl]) => {
      const [channels, messages] = await Promise.all([
        fetchJson<ChannelSearchItem[]>(channelsUrl),
        fetchJson<Message[]>(messagesUrl),
      ])

      return { channels, messages }
    },
    { suspense: true },
  )
}
