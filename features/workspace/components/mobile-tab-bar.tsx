'use client'

import type { Route } from 'next'
import { AtSign, House, Search, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Boundary } from '@/components/internal/boundary'
import { useActivityIndicator } from '@/features/workspace/hooks/use-activity-indicator'
import { cn } from '@/lib/utils'

type PrimaryNavItem = {
  href: string
  icon: LucideIcon
  label: string
  match: string[]
  showActivityDot?: boolean
}

const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    href: '/channels',
    icon: House,
    label: 'Home',
    match: ['/', '/channel', '/channels'],
  },
  {
    href: '/activity',
    icon: AtSign,
    label: 'Activity',
    match: ['/activity'],
    showActivityDot: true,
  },
]

function isNavActive(item: PrimaryNavItem, pathname: string | null) {
  if (!pathname) return false
  return item.match.some((prefix) => {
    if (prefix === '/') return pathname === '/'
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

export function MobileTabBar() {
  const pathname = usePathname()
  const { hasActivity } = useActivityIndicator()
  return <MobileTabBarShell hasActivity={hasActivity} pathname={pathname} />
}

export function MobileTabBarSkeleton() {
  return <MobileTabBarShell hasActivity={false} pathname={null} />
}

function MobileTabBarShell({
  hasActivity,
  pathname,
}: {
  hasActivity: boolean
  pathname: string | null
}) {
  return (
    <Boundary label="MobileTabBar" asChild>
      <nav
        aria-label="Primary"
        className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 fixed inset-x-0 bottom-0 z-40 flex shrink-0 border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] backdrop-blur-lg md:hidden"
        style={{ viewTransitionName: 'mobile-nav' }}
      >
        {PRIMARY_NAV.map((item) => {
          const { href, icon: Icon, label } = item
          const active = isNavActive(item, pathname)
          const showDot = item.showActivityDot && hasActivity && !active

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
              <span className="relative">
                <Icon
                  aria-hidden
                  className="size-5"
                  strokeWidth={active ? 2.5 : 2}
                />
                {showDot ? (
                  <span
                    aria-label="New activity"
                    className="bg-accent ring-surface dark:ring-surface-dark absolute -top-0.5 -right-1 size-2 rounded-full ring-2"
                  />
                ) : null}
              </span>
              {label}
            </Link>
          )
        })}
        <Link
          aria-current={pathname === '/search' ? 'page' : undefined}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition-colors',
            pathname === '/search'
              ? 'text-accent'
              : 'text-muted dark:text-muted-dark hover:text-black dark:hover:text-white',
          )}
          href={'/search' as Route}
          prefetch={true}
        >
          <Search
            aria-hidden
            className="size-5"
            strokeWidth={pathname === '/search' ? 2.5 : 2}
          />
          Search
        </Link>
      </nav>
    </Boundary>
  )
}
