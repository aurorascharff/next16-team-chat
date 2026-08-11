'use client'

import { Boundary } from '@/components/internal/boundary'
import { useValidMentions } from '@/features/user/hooks/use-valid-mentions'
import { formatMarkdown } from '@/features/message/utils/format'

export function MessagePreview({ body }: { body: string }) {
  const validMentions = useValidMentions()
  if (!body.trim()) {
    return (
      <Boundary label="MessagePreview" asChild>
        <p className="text-muted dark:text-muted-dark text-sm">
          Nothing to preview yet.
        </p>
      </Boundary>
    )
  }
  return (
    <Boundary label="MessagePreview" asChild>
      <div className="space-y-2 text-sm leading-relaxed">
        {formatMarkdown(body, validMentions)}
      </div>
    </Boundary>
  )
}
