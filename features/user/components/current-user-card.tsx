import { getCurrentUser } from '@/features/user/user-queries'
import { UserSwitcher } from './user-switcher'

export async function CurrentUserCard() {
  const user = await getCurrentUser()

  return (
    <section className="user-card">
      <div className="avatar" aria-hidden>
        {user.name
          .split(' ')
          .map((part) => part[0])
          .join('')}
      </div>
      <div className="user-card-copy">
        <p>{user.name}</p>
        <span>{user.role}</span>
      </div>
      <UserSwitcher currentUserId={user.id} />
    </section>
  )
}

export function CurrentUserCardSkeleton() {
  return (
    <section className="user-card">
      <div className="avatar muted" />
      <div className="user-card-copy">
        <div className="skeleton-line short" />
        <div className="skeleton-line tiny" />
      </div>
    </section>
  )
}
