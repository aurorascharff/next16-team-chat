'use client'

import { usePathname } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

function HideOnActivity({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/activity')) {
    return null
  }
  return children
}

export function SidebarVisibility({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <HideOnActivity>{children}</HideOnActivity>
    </Suspense>
  )
}
