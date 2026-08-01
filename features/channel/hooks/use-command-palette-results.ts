'use client'

import { useSuspenseQueries } from '@tanstack/react-query'
import { channelSearchQueryOptions } from '@/features/channel/channel-query-options'
import { workspaceSearchMessagesQueryOptions } from '@/features/message/message-query-options'

export function useCommandPaletteResults() {
  const [channels, messages] = useSuspenseQueries({
    queries: [
      channelSearchQueryOptions(),
      workspaceSearchMessagesQueryOptions(),
    ],
  })

  return {
    data: {
      channels: channels.data,
      messages: messages.data,
    },
  }
}
