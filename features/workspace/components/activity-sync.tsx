'use client'

import { useEffect, useRef } from 'react'
import { useSWRConfig } from 'swr'
import { useUnreadActivity } from '@/features/workspace/hooks/use-unread-activity'

// Keep the message and thread views in step with the activity badge. The
// unread-activity poll runs on a faster cadence and is the first to notice new
// replies (e.g. a Huddle Bot answer landing in a thread). When its count
// shifts, revalidate the message and reply caches in the same beat so the
// content and the notification surface together instead of drifting apart.
export function ActivitySync() {
  const { data } = useUnreadActivity()
  const { mutate } = useSWRConfig()
  const previousCount = useRef<number | null>(null)

  useEffect(() => {
    const count = data?.count
    if (count == null) return

    if (previousCount.current != null && count !== previousCount.current) {
      void mutate(
        (key) =>
          typeof key === 'string' &&
          ((key.startsWith('/api/channels/') && key.endsWith('/messages')) ||
            (key.startsWith('/api/messages/') && key.endsWith('/replies'))),
      )
    }

    previousCount.current = count
  }, [data, mutate])

  return null
}
