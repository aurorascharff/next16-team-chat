'use client'

import type { Route } from 'next'
import { AtSign, Hash, MessagesSquare, PencilLine } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/channels',
    icon: Hash,
    label: 'Channels',
    match: ['/channels', '/channel'],
  },
  { href: '/inbox', icon: AtSign, label: 'Inbox', match: ['/inbox'] },
  {
    href: '/threads',
    icon: MessagesSquare,
    label: 'Threads',
    match: ['/threads'],
  },
  { href: '/drafts', icon: PencilLine, label: 'Drafts', match: ['/drafts'] },
] as const

export function MobileTabBar() {
  const pathname = usePathname()

  return <MobileTabBarShell pathname={pathname} />
}

export function MobileTabBarSkeleton() {
  return <MobileTabBarShell pathname={null} />
}

function MobileTabBarShell({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 sticky bottom-0 z-40 flex shrink-0 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      {tabs.map(({ href, icon: Icon, label, match }) => {
        const active = pathname
          ? match.some((prefix) => {
              return pathname === prefix || pathname.startsWith(`${prefix}/`)
            })
          : false

        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition-colors',
              active
                ? 'text-accent'
                : 'text-muted dark:text-muted-dark hover:text-black dark:hover:text-white',
            )}
            href={href as Route}
            key={href}
            prefetch={true}
          >
            <Icon
              aria-hidden
              className="size-5"
              strokeWidth={active ? 2.5 : 2}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
