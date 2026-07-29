'use client'

import type { Route } from 'next'
import { useQuery } from '@tanstack/react-query'
import { Hash, Lock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { unreadChannelsQueryOptions } from '@/features/channel/channel-query-options'
import { cn } from '@/lib/utils'

type Props = {
  channel: {
    id: string
    isPrivate?: boolean
    name: string
    unread?: number
  }
}

export function ChannelLink({ channel }: Props) {
  const pathname = usePathname()
  const href = `/channel/${channel.id}` as Route
  const active = pathname === href
  const Icon = channel.isPrivate ? Lock : Hash
  const [mounted, setMounted] = useState(false)
  const { data: unreadMap } = useQuery(unreadChannelsQueryOptions())

  useEffect(() => {
    setMounted(true)
  }, [])

  // Server and first client render use the server-provided value to avoid a
  // hydration mismatch; after mount the React Query cache is the source of truth.
  const unread = mounted && unreadMap ? unreadMap[channel.id] : channel.unread

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-8 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-accent-fade text-accent'
          : 'text-muted dark:text-muted-dark hover:bg-card dark:hover:bg-card-dark hover:text-black dark:hover:text-white',
      )}
      href={href}
      prefetch={true}
    >
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
      {unread ? (
        <span className="bg-accent flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-bold text-white">
          {unread}
        </span>
      ) : null}
    </Link>
  )
}
