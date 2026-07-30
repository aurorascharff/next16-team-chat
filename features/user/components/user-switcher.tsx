'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeftRight } from 'lucide-react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { switchUser } from '@/features/user/user-actions'
import { cn } from '@/lib/utils'

export function UserSwitcher({ currentUserId }: { currentUserId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const nextUserId = currentUserId === 'ada' ? 'grace' : 'ada'

  return (
    <button
      aria-label="Switch user"
      className="text-muted dark:text-muted-dark hover:bg-surface dark:hover:bg-elevated-dark flex size-8 items-center justify-center rounded-lg transition-colors hover:text-black disabled:opacity-55 dark:hover:text-white"
      data-user-switching={isPending ? '' : undefined}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const destination = await switchUser(nextUserId)
          queryClient.clear()
          router.push(destination as Route)
        })
      }}
      title="Switch user"
      type="button"
    >
      <ArrowLeftRight
        aria-hidden
        className={cn('size-4 transition-transform', isPending && 'rotate-180')}
        strokeWidth={2}
      />
    </button>
  )
}
