'use client'

import { usePathname } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

function HideOnInbox({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/inbox')) {
    return null
  }
  return children
}

export function SidebarVisibility({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <HideOnInbox>{children}</HideOnInbox>
    </Suspense>
  )
}
