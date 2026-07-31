import { HydrationBoundary } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { channelKeys, channelTags } from '@/features/channel/channel-cache'
import {
  getCurrentChannelLayout,
  getUnreadChannels,
} from '@/features/channel/channel-queries'
import { dehydrate } from '@/lib/react-query-hydration'
import { ChannelNav } from './channel-nav'

export async function ChannelList() {
  const [{ groups, userId }, unread] = await Promise.all([
    getCurrentChannelLayout(),
    getUnreadChannels(),
  ])

  return (
    <HydrationBoundary
      state={await dehydrate([{ queryKey: channelKeys.unread, data: unread }], {
        tags: [channelTags.unread],
      })}
    >
      <ChannelNav groups={groups} key={userId} />
    </HydrationBoundary>
  )
}

export function ChannelListSkeleton() {
  return (
    <div
      aria-label="Loading channels"
      className="flex flex-col gap-0.5 opacity-45"
    >
      <p className="text-muted dark:text-muted-dark px-2.5 pt-1 pb-1 text-xs font-semibold tracking-wide uppercase">
        Channels
      </p>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <div className="flex min-h-8 items-center gap-2 px-2.5" key={i}>
            <Skeleton className="size-4 shrink-0 rounded" />
            {i < 3 ? <Skeleton className="h-3 w-24 rounded" /> : null}
          </div>
        )
      })}
    </div>
  )
}
