'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  channelKeys,
  type UnreadChannels,
} from '@/features/channel/channel-query-options'

export function useMarkChannelRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (channelId: string) => {
      const res = await fetch(`/api/channels/${channelId}/read`, {
        keepalive: true,
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to mark channel read')
      }
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
  })
}
