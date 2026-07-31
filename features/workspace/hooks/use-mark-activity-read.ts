'use client'

import { useSWRConfig } from 'swr'
import { markActivityReadAction } from '@/features/workspace/workspace-actions'
import { activityKeys } from '@/features/workspace/workspace-cache'
import type { UnreadActivity } from './use-unread-activity'

type MarkActivityReadInput = {
  itemIds: string[]
  optimistic: 'clear' | 'decrement'
}

export function useMarkActivityRead() {
  const { mutate } = useSWRConfig()

  return async function markActivityRead({
    itemIds,
    optimistic,
  }: MarkActivityReadInput) {
    function update(current?: UnreadActivity): UnreadActivity {
      if (optimistic === 'clear') {
        return { count: 0 }
      }

      return {
        count: Math.max(0, (current?.count ?? itemIds.length) - itemIds.length),
      }
    }

    await mutate<UnreadActivity>(
      activityKeys.unread,
      async (current) => {
        await markActivityReadAction(itemIds)
        return update(current)
      },
      {
        optimisticData: update,
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      },
    )
  }
}
