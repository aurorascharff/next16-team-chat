'use server'

import { isSlowMode } from '@/features/demo/slow-mode'
import { formatMarkdown } from '@/features/message/components/format'
import { delay } from '@/lib/utils'

export async function renderMessagePreview(body: string) {
  await delay(500, await isSlowMode())
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {formatMarkdown(body)}
    </div>
  )
}
