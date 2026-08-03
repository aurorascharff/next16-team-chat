'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'

// Keep the message and thread views in step with the activity badge. The
// unread-activity query polls on a faster cadence and is the first to notice
// new replies (e.g. a Huddle Bot answer landing in a thread). When its count
// shifts, invalidate the message and reply queries in the same beat so the
// content and the notification surface together instead of drifting apart.
export function ActivitySync() {
  const { data } = useQuery(unreadActivityQueryOptions())
  const queryClient = useQueryClient()
  const previousCount = useRef<number | null>(null)

  useEffect(() => {
    const count = data?.count
    if (count == null) return

    if (previousCount.current != null && count !== previousCount.current) {
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey
          return (
            (key[0] === 'messages' && key.length === 2) || key[0] === 'replies'
          )
        },
      })
    }

    previousCount.current = count
  }, [data, queryClient])

  return null
}
