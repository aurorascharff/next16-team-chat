'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markChannelReadAction } from '@/features/channel/channel-actions'
import { channelKeys } from '@/features/channel/channel-cache'
import type { UnreadChannels } from '@/features/channel/channel-query-options'

export function useMarkChannelRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (channelId: string) => {
      return markChannelReadAction(channelId)
    },
    onMutate: async (channelId: string) => {
      await queryClient.cancelQueries({ queryKey: channelKeys.unread })
      const previous = queryClient.getQueryData<UnreadChannels>(
        channelKeys.unread,
      )

      queryClient.setQueryData<UnreadChannels>(
        channelKeys.unread,
        (current = {}) => {
          const next = { ...current }
          delete next[channelId]
          return next
        },
      )

      return { previous }
    },
    onError: (_error, _channelId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(channelKeys.unread, context.previous)
      }
    },
    onSuccess: (readAt, channelId) => {
      queryClient.setQueryData(channelKeys.lastRead(channelId), readAt)
    },
  })
}
