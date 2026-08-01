import { preload, SWRConfig } from 'swr'
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
