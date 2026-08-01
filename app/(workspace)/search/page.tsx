import type { Metadata } from 'next'
import { MobileSearch } from '@/features/channel/components/mobile-search'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  return <MobileSearch />
}
