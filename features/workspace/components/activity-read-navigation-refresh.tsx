'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const ACTIVITY_READ_DIRTY_KEY = 'huddle:activity-read-dirty'

export function ActivityReadNavigationRefresh() {
  const pathname = usePathname()
  const router = useRouter()
  const previousPathname = useRef<string | null>(null)

  useEffect(() => {
    const previous = previousPathname.current
    previousPathname.current = pathname

    if (
      previous === '/activity' &&
      pathname !== '/activity' &&
      sessionStorage.getItem(ACTIVITY_READ_DIRTY_KEY) === '1'
    ) {
      sessionStorage.removeItem(ACTIVITY_READ_DIRTY_KEY)
      router.prefetch('/activity')
    }
  }, [pathname, router])

  return null
}
