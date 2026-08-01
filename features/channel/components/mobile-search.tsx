import { Search } from 'lucide-react'
import { preload, SWRConfig } from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { channelKeys } from '@/features/channel/channel-cache'
import { getChannelSearchResults } from '@/features/channel/channel-queries'
import { messageKeys } from '@/features/message/message-cache'
import { getWorkspaceSearchMessages } from '@/features/message/message-queries'
import { MobileSearchView } from './command-palette'

export function MobileSearch() {
  const searchData = preload(
    channelKeys.commandPalette(messageKeys.workspaceSearch),
    async () => {
      const [{ channels }, messages] = await Promise.all([
        getChannelSearchResults(),
        getWorkspaceSearchMessages(),
      ])
      return { channels, messages }
    },
  )

  return (
    <SWRConfig value={{ cacheData: { ...searchData } }}>
      <MobileSearchView />
    </SWRConfig>
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
