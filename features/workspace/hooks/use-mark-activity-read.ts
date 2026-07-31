'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markActivityReadAction } from '@/features/workspace/workspace-actions'
import { activityKeys } from '@/features/workspace/workspace-query-options'

type MarkActivityReadInput = {
  itemIds: string[]
  optimistic: 'clear' | 'decrement'
}

export function useMarkActivityRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemIds }: MarkActivityReadInput) => {
      await markActivityReadAction(itemIds)
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
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(activityKeys.unread, context.previous)
      } else {
        queryClient.invalidateQueries({ queryKey: activityKeys.unread })
      }
    },
  })
}
