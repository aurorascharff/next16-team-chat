'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Boundary } from '@/components/internal/boundary'
import { cn } from '@/lib/utils'

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <Boundary label="BackButton" asChild>
      <button
        aria-label="Go back"
        className={cn(
          'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark flex size-8 shrink-0 items-center justify-center rounded-lg hover:text-black dark:hover:text-white',
          className,
        )}
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft aria-hidden className="size-5" strokeWidth={2} />
      </button>
    </Boundary>
  )
}
