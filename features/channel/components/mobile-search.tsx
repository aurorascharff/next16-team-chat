import { preload, SWRConfig } from 'swr'
import { channelKeys } from '@/features/channel/channel-cache'
import { getChannelSearchResults } from '@/features/channel/channel-queries'
import { MobileSearchView } from './command-palette'

export function MobileSearch() {
  const searchData = preload(
    channelKeys.commandPalette(null),
    getChannelSearchResults,
  )

  return (
    <SWRConfig value={{ cacheData: { ...searchData } }}>
      <MobileSearchView />
    </SWRConfig>
  )
}
