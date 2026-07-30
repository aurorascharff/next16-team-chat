'use client'

import { useEffect } from 'react'
import { useMarkMentionsRead } from '@/features/message/message-mutations'

export function MarkMentionsRead() {
  const { mutate } = useMarkMentionsRead()

  useEffect(() => {
    mutate()
  }, [mutate])

  return null
}
