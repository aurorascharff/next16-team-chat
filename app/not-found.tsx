import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <EmptyState
        body="That route is not part of this workspace."
        title="Page not found"
      >
        <Button render={<Link href="/" />}>Back to Huddle</Button>
      </EmptyState>
    </main>
  )
}
