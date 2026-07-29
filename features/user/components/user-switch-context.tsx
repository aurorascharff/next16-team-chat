'use client'

import { createContext, useContext, useTransition, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type UserSwitchValue = {
  isSwitching: boolean
  switchTo: (action: () => Promise<void>) => void
}

const UserSwitchContext = createContext<UserSwitchValue | null>(null)

export function useUserSwitch() {
  const context = useContext(UserSwitchContext)

  if (!context) {
    throw new Error('useUserSwitch must be used within a UserSwitchProvider')
  }

  return context
}

export function UserSwitchProvider({ children }: { children: ReactNode }) {
  const [isSwitching, startTransition] = useTransition()

  const value = {
    isSwitching,
    switchTo: (action: () => Promise<void>) => {
      startTransition(async () => {
        await action()
      })
    },
  }

  return (
    <UserSwitchContext.Provider value={value}>
      <div
        className={cn(
          'flex min-h-dvh flex-col transition-opacity duration-200',
          isSwitching && 'pointer-events-none opacity-50',
        )}
      >
        {children}
      </div>
    </UserSwitchContext.Provider>
  )
}
