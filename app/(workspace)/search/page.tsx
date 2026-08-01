import type { Metadata } from 'next'
import { MobileSearch } from '@/features/channel/components/command-palette'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  return <MobileSearch />
}
