'use client'

import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { switchUser } from '@/features/user/user-actions'

export function UserSwitcher({ currentUserId }: { currentUserId: string }) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const nextUserId = currentUserId === 'ada' ? 'grace' : 'ada'

  return (
    <button
      className="switch-user"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await switchUser(nextUserId, pathname)
        })
      }}
      type="button"
    >
      {isPending ? 'Switching…' : 'Switch'}
    </button>
  )
}
