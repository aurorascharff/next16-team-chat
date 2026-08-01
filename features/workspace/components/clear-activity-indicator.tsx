'use client'

import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { activityKeys } from '@/features/workspace/workspace-cache'

export function ClearActivityIndicator() {
  const { mutate } = useSWRConfig()

  useEffect(() => {
    void mutate(activityKeys.unread, { count: 0 }, { revalidate: false })
  }, [mutate])

  return null
}
