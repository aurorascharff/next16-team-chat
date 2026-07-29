'use client'

import { formatMarkdown } from './format'

export function MessagePreview({ body }: { body: string }) {
  if (!body.trim()) {
    return (
      <p className="text-muted dark:text-muted-dark text-sm">
        Nothing to preview yet.
      </p>
    )
  }
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {formatMarkdown(body)}
    </div>
  )
}
