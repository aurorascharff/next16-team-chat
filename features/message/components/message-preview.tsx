'use client'

import { useValidMentions } from '@/features/user/use-valid-mentions'
import { formatMarkdown } from '@/features/message/utils/format'

export function MessagePreview({ body }: { body: string }) {
  const validMentions = useValidMentions()
  if (!body.trim()) {
    return (
      <p className="text-muted dark:text-muted-dark text-sm">
        Nothing to preview yet.
      </p>
    )
  }
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {formatMarkdown(body, validMentions)}
    </div>
  )
}
