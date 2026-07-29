import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
]

const BOT_COLOR =
  'bg-accent-fade text-accent dark:bg-accent/20 dark:text-blue-300'

const SIZES = {
  md: 'size-9 text-xs',
  sm: 'size-7 text-[0.625rem]',
} as const

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return COLORS[hash % COLORS.length]
}

export function UserAvatar({
  bot = false,
  name,
  size = 'md',
}: {
  name: string
  bot?: boolean
  size?: keyof typeof SIZES
}) {
  if (bot) {
    return (
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg',
          BOT_COLOR,
          SIZES[size],
        )}
      >
        <Bot className="size-4.5" strokeWidth={2} />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg font-semibold uppercase',
        colorFor(name),
        SIZES[size],
      )}
    >
      {initialsOf(name)}
    </div>
  )
}
