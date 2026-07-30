import { Users } from 'lucide-react'
import Link from 'next/link'

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

export function WorkspaceNav() {
  return (
    <Link
      className="hover:bg-card dark:hover:bg-card-dark flex items-center gap-2.5 rounded-lg p-1.5 transition-colors"
      href="/"
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
  )
}

export function WorkspaceNavSkeleton() {
  return (
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
  )
}
