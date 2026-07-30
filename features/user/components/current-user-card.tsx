import { UserAvatar } from '@/components/ui/user-avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentUser } from '@/features/user/user-queries'
import {
  ActivityOnly,
  SidebarVisibility,
} from '@/features/workspace/components/sidebar-visibility'
import { UserSwitcher } from './user-switcher'

export async function CurrentUserCard() {
  const user = await getCurrentUser()

  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 shrink-0 items-center border-t">
      <div className="relative flex h-full w-18 shrink-0 items-center justify-center">
        <UserAvatar bot={user.id === 'bot'} name={user.name} />
        <ActivityOnly>
          <span className="border-divider dark:border-divider-dark absolute inset-y-0 right-0 border-r" />
        </ActivityOnly>
      </div>
      <SidebarVisibility>
        <div className="border-divider dark:border-divider-dark flex h-full min-w-0 flex-1 items-center gap-2.5 border-r pr-3 pl-3">
          <div className="min-w-0 flex-1">
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
        </div>
      </SidebarVisibility>
    </section>
  )
}

export function CurrentUserCardSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-16 shrink-0 items-center border-t">
      <div className="flex h-full w-18 shrink-0 items-center justify-center">
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <div className="border-divider dark:border-divider-dark flex h-full flex-1 flex-col justify-center gap-1.5 border-r px-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded-full" />
      </div>
    </section>
  )
}
