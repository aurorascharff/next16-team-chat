import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function ChannelNotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        body="This channel may have been removed, or you may no longer have access."
        title="Channel not found"
      >
        <Button render={<Link href="/channels" />}>Back to channels</Button>
      </EmptyState>
    </div>
  )
}
