'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { markMentionsReadAction } from '@/features/message/message-mention-actions'
import { mentionKeys } from '@/features/message/message-mention-query-options'

export function MarkMentionsRead() {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: () => markMentionsReadAction(),
    onSuccess: () => {
      queryClient.setQueryData(mentionKeys.unread, { count: 0 })
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return null
}
