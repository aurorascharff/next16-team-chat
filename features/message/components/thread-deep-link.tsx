'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useThread } from './thread-context'

export function ThreadDeepLink({ channelId }: { channelId: string }) {
  const searchParams = useSearchParams()
  const threadParam = searchParams.get('thread')
  const { openThread } = useThread()

  useEffect(() => {
    if (threadParam) {
      openThread(channelId, threadParam)
    }
  }, [threadParam, channelId, openThread])

  return null
}
