'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'

export function useThread() {
  const router = useRouter()

  function openThread(nextChannelId: string, nextMessageId: string) {
    router.push(
      `/channel/${nextChannelId}/thread/${nextMessageId}` as Route,
    )
  }

  function closeThread() {
    router.back()
  }

  return { closeThread, openThread }
}
