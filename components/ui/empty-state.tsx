import { MessageSquareDashed } from 'lucide-react'

type EmptyStateProps = {
  title: string
  body?: string
  children?: React.ReactNode
}

export function EmptyState({ title, body, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span
        aria-hidden
        className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark flex size-11 items-center justify-center rounded-xl border"
      >
        <MessageSquareDashed className="size-5" strokeWidth={2} />
      </span>
      <h2 className="text-base">{title}</h2>
      {body ? (
        <p className="text-muted dark:text-muted-dark max-w-xs text-sm leading-relaxed">
          {body}
        </p>
      ) : null}
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  )
}
