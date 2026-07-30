'use client'

import { useEffect, useRef } from 'react'
import { apiUrl } from '@/lib/utils'

const INTERVAL_MS = 60_000

export function BotDriver() {
  const running = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (running.current || document.hidden) return
      running.current = true
      void fetch(apiUrl('/api/bot'), { method: 'POST' })
        .catch(() => {})
        .finally(() => {
          running.current = false
        })
    }, INTERVAL_MS)

    return () => {
      return clearInterval(id)
    }
  }, [])

  return null
}
