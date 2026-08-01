'use client'

import { AlertTriangle } from 'lucide-react'
import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(
  { compact, title }: { compact?: boolean; title?: string },
  { retry }: ErrorInfo,
) {
  return (
    <div
      className={
        compact
          ? 'flex flex-col items-center gap-2 px-4 py-4 text-center'
          : 'flex flex-col items-center gap-3 px-6 py-10 text-center'
      }
    >
      <AlertTriangle
        aria-hidden
        className={compact ? 'text-danger size-4' : 'text-danger size-6'}
        strokeWidth={2}
      />
      <p className="text-muted dark:text-muted-dark text-sm">
        {title ?? 'Something went wrong'}
      </p>
      <button
        className="border-divider dark:border-divider-dark bg-elevated hover:bg-card dark:bg-elevated-dark dark:hover:bg-card-dark flex min-h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold"
        onClick={retry}
        type="button"
      >
        Try again
      </button>
    </div>
  )
}

export const ErrorBoundary = catchError(ErrorFallback)
