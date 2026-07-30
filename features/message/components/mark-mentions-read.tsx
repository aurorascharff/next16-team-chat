'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { mentionKeys } from '@/features/message/message-query-options'
import { apiUrl } from '@/lib/utils'

export function MarkMentionsRead() {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryData(mentionKeys.unread, { count: 0 })
    void fetch(apiUrl('/api/mentions/read'), {
      keepalive: true,
      method: 'POST',
    }).catch(() => {})
  }, [queryClient])

  return null
}
