'use client'

import type { Route } from 'next'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActivityIndicator } from '@/features/workspace/hooks/use-activity-indicator'
import {
  isNavActive,
  PRIMARY_NAV,
} from '@/features/workspace/utils/primary-nav'
import { cn } from '@/lib/utils'

export function MobileTabBar() {
  const pathname = usePathname()
  const { clearActivity, hasActivity } = useActivityIndicator()

  return (
    <MobileTabBarShell
      hasActivity={hasActivity}
      pathname={pathname}
      onActivityNavigate={clearActivity}
    />
  )
}

export function MobileTabBarSkeleton() {
  return <MobileTabBarShell hasActivity={false} pathname={null} />
}

function MobileTabBarShell({
  hasActivity,
  onActivityNavigate,
  pathname,
}: {
  hasActivity: boolean
  onActivityNavigate?: () => void
  pathname: string | null
}) {
  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 sticky bottom-0 z-40 flex shrink-0 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
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
            onClick={item.showActivityDot ? onActivityNavigate : undefined}
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
      <button
        className="text-muted dark:text-muted-dark flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition-colors hover:text-black dark:hover:text-white"
        onClick={() => {
          window.dispatchEvent(new Event('open-command-palette'))
        }}
        type="button"
      >
        <Search aria-hidden className="size-5" strokeWidth={2} />
        Search
      </button>
    </nav>
  )
}
