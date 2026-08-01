import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  MobileSearch,
  MobileSearchSkeleton,
} from '@/features/channel/components/mobile-search'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  return (
    <Suspense fallback={<MobileSearchSkeleton />}>
      <MobileSearch />
    </Suspense>
  )
}
