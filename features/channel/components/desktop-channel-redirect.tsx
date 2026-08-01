'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function DesktopChannelRedirect({ href }: { href: Route }) {
  const router = useRouter()

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')

    if (desktop.matches) {
      router.replace(href)
    }
  }, [href, router])

  return null
}
