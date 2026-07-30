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

function ShowOnActivity({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/activity')) {
    return children
  }
  return null
}

export function SidebarVisibility({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <HideOnActivity>{children}</HideOnActivity>
    </Suspense>
  )
}

export function ActivityOnly({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ShowOnActivity>{children}</ShowOnActivity>
    </Suspense>
  )
}
