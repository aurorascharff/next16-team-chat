'use client'

import useSWR from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import type { ChannelSearchItem } from '@/features/channel/hooks/use-channel-search'
import { messageKeys } from '@/features/message/message-cache'
import type { Message } from '@/features/message/types/message'
import { fetchJson } from '@/lib/fetch-json'

export function useCommandPaletteResults(channelId?: string) {
  const messagesKey = channelId ? messageKeys.channel(channelId) : null

  return useSWR(
    ['command-palette', channelKeys.all, messagesKey] as const,
    async ([, channelsUrl, messagesUrl]) => {
      const [channels, messages] = await Promise.all([
        fetchJson<ChannelSearchItem[]>(channelsUrl),
        messagesUrl
          ? fetchJson<Message[]>(messagesUrl)
          : Promise.resolve([] as Message[]),
      ])

      return { channels, messages }
    },
    { suspense: true },
  )
}
