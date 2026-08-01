import { HydrationBoundary } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { channelKeys, channelTags } from '@/features/channel/channel-cache'
import { getChannelSearchResults } from '@/features/channel/channel-queries'
import { messageKeys, messageTags } from '@/features/message/message-cache'
import { getWorkspaceSearchMessages } from '@/features/message/message-queries'
import { dehydrate } from '@/lib/react-query-hydration'
import { MobileSearchView } from './command-palette'

export async function MobileSearch() {
  const [{ channels }, messages] = await Promise.all([
    getChannelSearchResults(),
    getWorkspaceSearchMessages(),
  ])

  return (
    <HydrationBoundary
      state={await dehydrate(
        [
          { queryKey: channelKeys.all, data: channels },
          { queryKey: messageKeys.workspaceSearch, data: messages },
        ],
        { tags: [channelTags.all, messageTags.all] },
      )}
    >
      <MobileSearchView />
    </HydrationBoundary>
  )
}

export function MobileSearchSkeleton() {
  return (
    <section
      aria-label="Loading search"
      className="flex h-[calc(100dvh-3.5rem)] flex-col px-3 pt-3 md:hidden"
    >
      <div className="border-divider dark:border-divider-dark flex h-12 items-center gap-2.5 border-b px-4">
        <Search
          aria-hidden
          className="text-gray size-4 shrink-0"
          strokeWidth={2}
        />
        <span className="text-muted dark:text-muted-dark text-sm">
          Search channels and messages…
        </span>
      </div>
      <div className="flex flex-col gap-3 p-3 opacity-45">
        {Array.from({ length: 6 }).map((_, index) => {
          return <Skeleton className="h-8 w-full rounded-lg" key={index} />
        })}
      </div>
    </section>
  )
}
