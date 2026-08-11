'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { Boundary } from '@/components/internal/boundary'
import { Button } from '@/components/ui/button'

export default function WorkspaceError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Boundary label="WorkspaceError" asChild>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span
          aria-hidden
          className="border-divider dark:border-divider-dark text-danger flex size-11 items-center justify-center rounded-xl border"
        >
          <AlertTriangle className="size-5" strokeWidth={2} />
        </span>
        <h2 className="text-base">Something went wrong</h2>
        <p className="text-muted dark:text-muted-dark max-w-xs text-sm leading-relaxed">
          We couldn’t load this part of the workspace. Try again.
        </p>
        <Button className="mt-1" onClick={retry} variant="secondary">
          Try again
        </Button>
      </div>
    </Boundary>
  )
}
