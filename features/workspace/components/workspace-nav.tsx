import Link from 'next/link'
import { GitHubLink } from '@/components/ui/github-link'
import { HuddleMark } from '@/components/ui/huddle-mark'

export function WorkspaceNav() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        className="hover:bg-card dark:hover:bg-card-dark flex min-w-0 items-center gap-2.5 rounded-lg p-1.5"
        href="/"
      >
        <HuddleMark className="size-7" />
        <span className="flex min-w-0 flex-col leading-tight">
          <strong className="text-[0.9375rem] font-semibold tracking-tight">
            Huddle
          </strong>
          <small className="text-muted dark:text-muted-dark text-xs">
            Team workspace
          </small>
        </span>
      </Link>
      <GitHubLink />
    </div>
  )
}

export function WorkspaceNavSkeleton() {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2.5 p-1.5">
        <HuddleMark className="size-7" />
        <span className="flex flex-col leading-tight">
          <strong className="text-[0.9375rem] font-semibold tracking-tight">
            Huddle
          </strong>
          <small className="text-muted dark:text-muted-dark text-xs">
            Team workspace
          </small>
        </span>
      </span>
    </div>
  )
}
