'use client'

import { ArrowLeftRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { switchUser } from '@/features/user/user-actions'
import { cn } from '@/lib/utils'

export function UserSwitcher({ currentUserId }: { currentUserId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const nextUserId = currentUserId === 'ada' ? 'grace' : 'ada'

  return (
    <button
      aria-label="Switch user"
      className="text-muted dark:text-muted-dark hover:bg-surface dark:hover:bg-elevated-dark flex size-8 items-center justify-center rounded-lg transition-colors hover:text-black disabled:cursor-progress disabled:opacity-55 dark:hover:text-white"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await switchUser(nextUserId)
          router.push('/')
          router.refresh()
        })
      }}
      title="Switch user"
      type="button"
    >
      <ArrowLeftRight
        aria-hidden
        className={cn('size-4', isPending && 'animate-pulse')}
        strokeWidth={2}
      />
    </button>
  )
}
