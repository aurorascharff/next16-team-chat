'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { activityKeys } from '@/features/workspace/workspace-cache'

export function ClearActivityIndicator() {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryData(activityKeys.unread, { count: 0 })
  }, [queryClient])

  return null
}
