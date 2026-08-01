'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'

export function useThread() {
  const router = useRouter()

  function closeThread() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      const match = window.location.pathname.match(/^\/channel\/([^/]+)/)
      if (match?.[1]) {
        router.replace(`/channel/${match[1]}` as Route)
        return
      }
    }

    router.back()
  }

  return { closeThread }
}
