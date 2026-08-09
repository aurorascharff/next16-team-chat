import { ThemeToggle } from '@/components/theme/theme-toggle'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentUser } from '@/features/user/user-queries'
import { UserSwitcher } from './user-switcher'

export async function CurrentUserCard() {
  const user = await getCurrentUser()

  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 shrink-0 items-center border-t">
      <div className="relative flex h-full w-18 shrink-0 items-center justify-center">
        <UserAvatar bot={user.id === 'bot'} name={user.name} />
      </div>
      <div className="border-divider dark:border-divider-dark flex h-full min-w-0 flex-1 items-center justify-between gap-2 border-r px-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-muted dark:text-muted-dark truncate text-xs">
            {user.role}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <UserSwitcher currentUserId={user.id} />
        </div>
      </div>
    </section>
  )
}

export async function CurrentUserRailCard() {
  const user = await getCurrentUser()

  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 w-18 shrink-0 items-center border-t border-r">
      <div className="flex h-full w-18 shrink-0 items-center justify-center">
        <UserAvatar bot={user.id === 'bot'} name={user.name} />
      </div>
    </section>
  )
}

export function CurrentUserCardSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 shrink-0 items-center border-t">
      <div className="relative flex h-full w-18 shrink-0 items-center justify-center">
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <div className="border-divider dark:border-divider-dark flex h-full flex-1 items-center justify-between border-r px-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-7 w-22 rounded-full" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </section>
  )
}

export function CurrentUserRailCardSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 w-18 shrink-0 items-center border-t border-r">
      <div className="flex h-full w-18 shrink-0 items-center justify-center">
        <Skeleton className="size-9 rounded-lg" />
      </div>
    </section>
  )
}
