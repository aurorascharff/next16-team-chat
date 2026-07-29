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

  return (
    <ThreadContext.Provider
      value={{
        activeThread,
        closeThread: () => {
          return setActiveThread(null)
        },
        openThread: (channelId, messageId) => {
          return setActiveThread({ channelId, messageId })
        },
      }}
    >
      {children}
    </ThreadContext.Provider>
  )
}
