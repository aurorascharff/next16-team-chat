import Link from 'next/link'
import { EmptyState } from '@/components/ui/empty-state'

export default function ChannelNotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        body="This channel may have been removed, or you may no longer have access."
        title="Channel not found"
      >
        <Link
          className="bg-accent hover:bg-accent-hover flex min-h-9 items-center justify-center rounded-lg px-3.5 text-[0.8125rem] font-semibold text-white transition-colors"
          href="/channels"
        >
          Back to channels
        </Link>
      </EmptyState>
    </div>
  )
}
