'use client'

import { ArrowLeftRight } from 'lucide-react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useSWRConfig } from 'swr'
import { IconButton } from '@/components/ui/icon-button'
import { switchUser } from '@/features/user/user-actions'
import { cn } from '@/lib/utils'

export function UserSwitcher({ currentUserId }: { currentUserId: string }) {
  const router = useRouter()
  const { unload } = useSWRConfig()
  const [isPending, startTransition] = useTransition()
  const nextUserId = currentUserId === 'ada' ? 'grace' : 'ada'

  return (
    <IconButton
      className="hover:bg-surface dark:hover:bg-elevated-dark disabled:opacity-55"
      data-component="UserSwitcher"
      data-user-switching={isPending ? '' : undefined}
      disabled={isPending}
      label="Switch user"
      onClick={() => {
        startTransition(async () => {
          const destination = await switchUser(nextUserId)
          unload({ revalidate: false })
          router.push(destination as Route)
        })
      }}
      title="Switch user"
    >
      <ArrowLeftRight
        aria-hidden
        className={cn('size-4 transition-transform', isPending && 'rotate-180')}
        strokeWidth={2}
      />
    </IconButton>
  )
}
