'use client'

import { useQuery } from '@tanstack/react-query'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { unreadActivityQueryOptions } from '@/features/workspace/workspace-query-options'
import {
  isNavActive,
  PRIMARY_NAV,
} from '@/features/workspace/utils/primary-nav'
import { cn } from '@/lib/utils'

type PrimaryNavItem = (typeof PRIMARY_NAV)[number]

export function WorkspaceRail() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-full w-18 shrink-0 flex-col items-center gap-1 border-r pt-3"
    >
      {PRIMARY_NAV.map((item) => {
        return <NavLink item={item} key={item.href} />
      })}
    </nav>
  )
}

function NavLink({ item }: { item: PrimaryNavItem }) {
  return (
    <Suspense fallback={<NavLinkShell item={item} />}>
      <NavLinkInner item={item} />
    </Suspense>
  )
}

function NavLinkInner({ item }: { item: PrimaryNavItem }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { data: activity } = useQuery({
    ...unreadActivityQueryOptions(),
    enabled: Boolean(item.showActivityDot),
  })
  const isActive = isNavActive(item, pathname)
  const hasActivity =
    item.showActivityDot && mounted && Boolean(activity && activity.count > 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NavLinkShell hasActivity={hasActivity} isActive={isActive} item={item} />
  )
}

function NavLinkShell({
  hasActivity = false,
  isActive = false,
  item,
}: {
  hasActivity?: boolean
  isActive?: boolean
  item: PrimaryNavItem
}) {
  const { href, icon: Icon, label } = item
  const showDot = item.showActivityDot && hasActivity && !isActive

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[0.625rem] font-medium transition-colors',
        isActive
          ? 'text-accent'
          : 'text-muted dark:text-muted-dark hover:text-black dark:hover:text-white',
      )}
      href={href as Route}
      prefetch={true}
      suppressHydrationWarning
    >
      <span
        className={cn(
          'relative flex size-9 items-center justify-center rounded-xl transition-colors',
          isActive ? 'bg-accent-fade' : 'hover:bg-card dark:hover:bg-card-dark',
        )}
        suppressHydrationWarning
      >
        <Icon aria-hidden className="size-5" strokeWidth={isActive ? 2.5 : 2} />
        {showDot ? (
          <span
            aria-label="New activity"
            className="bg-accent ring-elevated dark:ring-elevated-dark absolute top-1 right-1 size-2 rounded-full ring-2"
          />
        ) : null}
      </span>
      {label}
    </Link>
  )
}
