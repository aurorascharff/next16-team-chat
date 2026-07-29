import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
]

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
          'flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-600 text-white shadow-sm',
          SIZES[size],
        )}
      >
        <Bot className="size-4" strokeWidth={2.25} />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg font-bold text-white uppercase',
        colorFor(name),
        SIZES[size],
      )}
    >
      {initialsOf(name)}
    </div>
  )
}
