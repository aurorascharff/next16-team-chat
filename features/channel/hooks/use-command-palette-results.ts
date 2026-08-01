'use client'

import { queryOptions, useSuspenseQueries } from '@tanstack/react-query'
import { channelSearchQueryOptions } from '@/features/channel/channel-query-options'
import { messageKeys } from '@/features/message/message-cache'
import { messagesQueryOptions } from '@/features/message/message-query-options'
import type { Message } from '@/features/message/types/message'

const emptyMessagesQueryOptions = queryOptions({
  queryFn: async (): Promise<Message[]> => [],
  queryKey: messageKeys.channel('command-palette'),
  staleTime: Infinity,
})

export function useCommandPaletteResults(channelId?: string) {
  const [channels, messages] = useSuspenseQueries({
    queries: [
      channelSearchQueryOptions(),
      channelId ? messagesQueryOptions(channelId) : emptyMessagesQueryOptions,
    ],
  })

  return {
    data: {
      channels: channels.data,
      messages: messages.data,
    },
  }
}
