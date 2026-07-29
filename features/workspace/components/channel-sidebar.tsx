'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function ChannelSidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname?.startsWith('/inbox')) {
    return null
  }

  return (
    <aside className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark sticky top-0 z-20 hidden h-dvh w-64 shrink-0 flex-col gap-4 border-r p-3 md:flex">
      {children}
    </aside>
  )
}
