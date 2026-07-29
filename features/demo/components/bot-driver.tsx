'use client'

import { useEffect, useRef } from 'react'
import { postBotMessage } from '@/features/demo/bot-actions'

const INTERVAL_MS = 20_000

// Drives fake background activity so the app feels alive: every ~20s the bot
// posts a message to a random channel, which the polling message query reveals.
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
