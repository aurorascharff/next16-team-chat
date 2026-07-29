'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type ActiveThread = { channelId: string; messageId: string } | null

type ThreadContextValue = {
  activeThread: ActiveThread
  openThread: (channelId: string, messageId: string) => void
  closeThread: () => void
}

const ThreadContext = createContext<ThreadContextValue | null>(null)

export function useThread() {
  const context = useContext(ThreadContext)

  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider')
  }

  return context
}

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [activeThread, setActiveThread] = useState<ActiveThread>(null)

  function closeThread() {
    setActiveThread(null)
  }

  function openThread(channelId: string, messageId: string) {
    setActiveThread({ channelId, messageId })
  }

  const value = { activeThread, closeThread, openThread }

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  )
}
