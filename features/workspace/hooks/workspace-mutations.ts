'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activityKeys } from '@/features/workspace/workspace-query-options'

type MarkActivityReadInput = {
  itemIds: string[]
  optimistic: 'clear' | 'decrement'
}

export function useMarkActivityRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemIds }: MarkActivityReadInput) => {
      const res = await fetch('/api/activity/read', {
        body: JSON.stringify({ itemIds }),
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to mark activity read')
      }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(activityKeys.unread, context.previous)
      } else {
        queryClient.invalidateQueries({ queryKey: activityKeys.unread })
      }
    },
    onMutate: async ({ itemIds, optimistic }: MarkActivityReadInput) => {
      await queryClient.cancelQueries({ queryKey: activityKeys.unread })
      const previous = queryClient.getQueryData<{ count: number }>(
        activityKeys.unread,
      )

      queryClient.setQueryData<{ count: number }>(
        activityKeys.unread,
        (current) => {
          if (optimistic === 'clear') {
            return { count: 0 }
          }

          return {
            count: Math.max(
              0,
              (current?.count ?? itemIds.length) - itemIds.length,
            ),
          }
        },
      )

      return { previous }
    },
  })
}
