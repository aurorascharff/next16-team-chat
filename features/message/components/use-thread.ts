'use client'

import type { Route } from 'next'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

type ActiveThread = { channelId: string; messageId: string } | null

export function useThread() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { channelId } = useParams<{ channelId: string }>()
  const messageId = searchParams.get('thread')

  const activeThread: ActiveThread = messageId ? { channelId, messageId } : null

  function openThread(_channelId: string, nextMessageId: string) {
    router.replace(`/channel/${channelId}?thread=${nextMessageId}` as Route, {
      scroll: false,
    })
  }

  function closeThread() {
    router.replace(`/channel/${channelId}` as Route, { scroll: false })
  }

  return { activeThread, closeThread, openThread }
}
