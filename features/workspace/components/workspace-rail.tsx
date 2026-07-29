'use client'

import type { Route } from 'next'
import { Search, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavActive, PRIMARY_NAV } from '@/features/workspace/primary-nav'
import { cn } from '@/lib/utils'

export function WorkspaceRail() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark sticky top-0 z-30 hidden h-dvh w-18 shrink-0 flex-col items-center gap-1 border-r py-3 md:flex"
    >
      <span
        aria-hidden
        className="from-accent to-accent-hover mb-2 flex size-9 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-sm"
      >
        <Users className="size-4.5" strokeWidth={2.5} />
      </span>
      {PRIMARY_NAV.map((item) => {
        const { href, icon: Icon, label } = item
        const isActive = isNavActive(item, pathname)

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
                'flex size-9 items-center justify-center rounded-xl transition-colors',
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
            </span>
            {label}
          </Link>
        )
      })}
      <button
        className="text-muted dark:text-muted-dark flex w-full flex-col items-center gap-1 rounded-lg py-1.5 text-[0.625rem] font-medium transition-colors hover:text-black dark:hover:text-white"
        onClick={() => {
          window.dispatchEvent(new Event('open-command-palette'))
        }}
        type="button"
      >
        <span className="hover:bg-card dark:hover:bg-card-dark flex size-9 items-center justify-center rounded-xl transition-colors">
          <Search aria-hidden className="size-5" strokeWidth={2} />
        </span>
        Search
      </button>
    </nav>
  )
}
