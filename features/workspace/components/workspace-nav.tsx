import { Users } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { readSeenSections } from '@/features/notification/notification-store'
import { cn } from '@/lib/utils'
import { WorkspaceNavLinks } from './workspace-nav-links'

function BrandMark() {
  return (
    <span
      aria-hidden
      className="from-accent to-accent-hover flex size-8 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm"
    >
      <Users className="size-4" strokeWidth={2.5} />
    </span>
  )
}

export async function WorkspaceNav() {
  const seen = await readSeenSections()

  return (
    <div className="flex flex-col gap-3">
      <Link
        className="hover:bg-card dark:hover:bg-card-dark flex items-center gap-2.5 rounded-lg p-1.5 transition-colors"
        href="/"
        prefetch={true}
      >
        <BrandMark />
        <span className="flex min-w-0 flex-col leading-tight">
          <strong className="text-[0.9375rem] font-semibold tracking-tight">
            Huddle
          </strong>
          <small className="text-muted dark:text-muted-dark text-xs">
            Team workspace
          </small>
        </span>
      </Link>
      <WorkspaceNavLinks seen={seen} />
    </div>
  )
}

export function WorkspaceNavSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 p-1.5">
        <BrandMark />
        <span className="flex flex-col leading-tight">
          <strong className="text-[0.9375rem] font-semibold tracking-tight">
            Huddle
          </strong>
          <small className="text-muted dark:text-muted-dark text-xs">
            Team workspace
          </small>
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {['w-16', 'w-20', 'w-14'].map((width, i) => {
          return (
            <div className="flex min-h-8 items-center gap-2.5 px-2.5" key={i}>
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className={cn('h-3 rounded-full', width)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
