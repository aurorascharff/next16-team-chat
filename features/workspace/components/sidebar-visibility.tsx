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

function ShowOnInbox({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/inbox')) {
    return children
  }
  return null
}

export function SidebarVisibility({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <HideOnInbox>{children}</HideOnInbox>
    </Suspense>
  )
}

export function InboxOnly({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ShowOnInbox>{children}</ShowOnInbox>
    </Suspense>
  )
}
