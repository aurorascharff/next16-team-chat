'use client'

import { catchError, type ErrorInfo } from 'next/error'
import { useTransition } from 'react'
import { Boundary } from '@/components/internal/boundary'
import { Button } from '@/components/ui/button'
import { HuddleMark } from '@/components/ui/huddle-mark'
import { Spinner } from '@/components/ui/spinner'

function ErrorFallback(
  { compact, title }: { compact?: boolean; title?: string },
  { retry }: ErrorInfo,
) {
  const [isPending, startTransition] = useTransition()

  return (
    <Boundary label="ErrorBoundary" asChild>
      <div
        className={
          compact
            ? 'flex flex-col items-center gap-2 px-4 py-4 text-center'
            : 'flex flex-col items-center gap-3 px-6 py-10 text-center'
        }
      >
        <HuddleMark
          className={compact ? 'text-danger size-5' : 'text-danger size-8'}
        />
        <p className="text-muted dark:text-muted-dark text-sm">
          {title ?? 'Something went wrong'}
        </p>
        <Button
          aria-busy={isPending}
          disabled={isPending}
          onClick={() => startTransition(() => retry())}
          size="sm"
          variant="secondary"
        >
          {isPending && <Spinner />}
          {isPending ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    </Boundary>
  )
}

export const ErrorBoundary = catchError(ErrorFallback)
