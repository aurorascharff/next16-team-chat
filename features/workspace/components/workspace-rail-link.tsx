'use client'

import type { Route } from 'next'
import { AtSign, House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActivityIndicator } from '@/features/workspace/hooks/use-activity-indicator'
import { cn } from '@/lib/utils'

type Item = {
  href: Route
  icon: 'activity' | 'home'
  label: string
  match: string[]
  showActivityDot?: boolean
}

export function WorkspaceRailLink({ item }: { item: Item }) {
  const pathname = usePathname()
  const { hasActivity } = useActivityIndicator(Boolean(item.showActivityDot))
  const isActive = item.match.some((prefix) => {
    if (prefix === '/') return pathname === '/'
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
  return (
    <WorkspaceRailLinkShell
      hasActivity={hasActivity}
      isActive={isActive}
      item={item}
    />
  )
}

export function WorkspaceRailLinkShell({
  hasActivity = false,
  isActive = false,
  item,
}: {
  hasActivity?: boolean
  isActive?: boolean
  item: Item
}) {
  const { href, icon, label } = item
  const Icon = icon === 'home' ? House : AtSign
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
      href={href}
      prefetch={true}
    >
      <span
        className={cn(
          'relative flex size-9 items-center justify-center rounded-xl transition-colors',
          isActive ? 'bg-accent-fade' : 'hover:bg-card dark:hover:bg-card-dark',
        )}
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

export function WorkspaceRailLinkSkeleton({ item }: { item: Item }) {
  const Icon = item.icon === 'home' ? House : AtSign

  return (
    <span
      aria-hidden
      className="text-muted dark:text-muted-dark flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[0.625rem] font-medium opacity-50"
    >
      <span className="flex size-9 items-center justify-center">
        <Icon aria-hidden className="size-5" />
      </span>
      {item.label}
    </span>
  )
}
