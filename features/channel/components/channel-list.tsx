import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getChannelLayout,
  getUnreadChannels,
} from '@/features/channel/channel-queries'
import { channelKeys } from '@/features/channel/hooks/channel-query-options'
import { getCurrentUser } from '@/features/user/user-queries'
import { cn } from '@/lib/utils'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const [user, groups, unread] = await Promise.all([
    getCurrentUser(),
    getChannelLayout(),
    getUnreadChannels(),
  ])

  const queryClient = new QueryClient()
  queryClient.setQueryData(channelKeys.unread, unread)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelNav groups={groups} key={user.id} />
    </HydrationBoundary>
  )
}

export function ChannelListSkeleton() {
  const widths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-16']

  return (
    <div aria-label="Loading channels" className="flex flex-col gap-0.5">
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {widths.map((width, i) => {
        return (
          <div className="flex min-h-8 items-center gap-2 px-2.5" key={i}>
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className={cn('h-3 rounded-full', width)} />
          </div>
        )
      })}
    </div>
  )
}
