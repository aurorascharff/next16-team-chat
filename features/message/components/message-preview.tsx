'use client'

import { use, type ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export type Preview = { body: string; node: Promise<ReactNode> }

export function MessagePreview({ preview }: { preview: Preview | null }) {
  if (!preview) {
    return (
      <p className="text-muted dark:text-muted-dark text-sm">
        Nothing to preview yet.
      </p>
    )
  }
  return use(preview.node)
}

export function PreviewSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3.5 w-full rounded-full" />
      <Skeleton className="h-3.5 w-2/3 rounded-full" />
    </div>
  )
}
