import { HydrationBoundary } from '@tanstack/react-query'
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
