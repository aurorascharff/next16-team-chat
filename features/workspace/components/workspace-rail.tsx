'use client'

import { useQuery } from '@tanstack/react-query'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { unreadMentionsQueryOptions } from '@/features/message/hooks/message-query-options'
import {
  isNavActive,
  PRIMARY_NAV,
} from '@/features/workspace/utils/primary-nav'
import { cn } from '@/lib/utils'

export function WorkspaceRail() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { data: mentions } = useQuery(unreadMentionsQueryOptions())
  const hasActivity = mounted && Boolean(mentions && mentions.count > 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-full w-18 shrink-0 flex-col items-center gap-1 border-r pt-3"
    >
      {PRIMARY_NAV.map((item) => {
        const { href, icon: Icon, label } = item
        const isActive = isNavActive(item, pathname)
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
            key={href}
            prefetch={true}
          >
            <span
              className={cn(
                'relative flex size-9 items-center justify-center rounded-xl transition-colors',
                isActive
                  ? 'bg-accent-fade'
                  : 'hover:bg-card dark:hover:bg-card-dark',
              )}
            >
              <Icon
                aria-hidden
                className="size-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
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
      })}
    </nav>
  )
}
