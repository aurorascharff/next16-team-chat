'use client'

import { useEffect, useRef } from 'react'
import { postBotMessage } from '@/features/demo/bot-actions'

const INTERVAL_MS = 60_000

export function BotDriver() {
  const running = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (running.current) return
      running.current = true
      void postBotMessage().finally(() => {
        running.current = false
      })
    }, INTERVAL_MS)

    return () => {
      return clearInterval(id)
    }
  }, [])

  return null
}
