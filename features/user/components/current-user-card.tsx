import { UserAvatar } from '@/components/ui/user-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentUser } from '@/features/user/user-queries'
import { UserSwitcher } from './user-switcher'

export async function CurrentUserCard() {
  const user = await getCurrentUser()

  return (
    <section className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border p-2.5">
      <UserAvatar bot={user.id === 'bot'} name={user.name} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <span className="text-muted dark:text-muted-dark flex items-center gap-1.5 truncate text-xs">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-emerald-500"
          />
          Active
        </span>
      </div>
      <UserSwitcher currentUserId={user.id} />
    </section>
  )
}

export function CurrentUserCardSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark bg-card dark:bg-card-dark grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 rounded-xl border p-2.5">
      <Skeleton className="size-9 rounded-lg" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded-full" />
      </div>
    </section>
  )
}
