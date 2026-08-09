import { isPrefetchMode } from '@/features/demo/prefetch-actions'
import { isSlowMode } from '@/features/demo/slow-mode'
import { DemoToolbarClient } from './demo-toolbar-client'

export async function DemoToolbar() {
  const [prefetchEnabled, slowEnabled] = await Promise.all([
    isPrefetchMode(),
    isSlowMode(),
  ])

  return (
    <DemoToolbarClient
      prefetchEnabled={prefetchEnabled}
      slowEnabled={slowEnabled}
    />
  )
}
