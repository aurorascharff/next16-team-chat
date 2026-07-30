'use client'

import { useParams, useSearchParams } from 'next/navigation'

type ActiveThread = { channelId: string; messageId: string } | null

export function useThread() {
  const searchParams = useSearchParams()
  const { channelId } = useParams<{ channelId: string }>()
  const messageId = searchParams.get('thread')

  const activeThread: ActiveThread = messageId ? { channelId, messageId } : null

  function openThread(_channelId: string, nextMessageId: string) {
    const params = new URLSearchParams(searchParams)
    params.set('thread', nextMessageId)
    window.history.replaceState(null, '', `?${params}`)
  }

  function closeThread() {
    const params = new URLSearchParams(searchParams)
    params.delete('thread')
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `?${query}` : location.pathname,
    )
  }

  return { activeThread, closeThread, openThread }
}
