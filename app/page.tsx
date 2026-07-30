import { Suspense } from 'react'
import { FirstChannelRedirect } from '@/features/channel/components/first-channel-redirect'

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <FirstChannelRedirect />
    </Suspense>
  )
}
