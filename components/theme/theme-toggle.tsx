'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Boundary } from '@/components/internal/boundary'
import { cn } from '@/lib/utils'
import { useIsMounted } from '@/lib/use-is-mounted'

const options = [
  { icon: Sun, label: 'Light', value: 'light' },
  { icon: Moon, label: 'Dark', value: 'dark' },
  { icon: Monitor, label: 'System', value: 'system' },
] as const

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const mounted = useIsMounted()

  return (
    <Boundary label="ThemeToggle" asChild>
      <div className="inline-flex items-center gap-0.5">
        {options.map(({ icon: Icon, label, value }) => {
          const active = mounted && theme === value

          return (
            <button
              aria-label={`${label} theme`}
              aria-pressed={active}
              className={cn(
                'flex size-7 items-center justify-center rounded-full transition-colors',
                active
                  ? 'bg-accent-fade text-accent'
                  : 'text-muted hover:text-black dark:hover:text-white',
              )}
              key={value}
              onClick={() => {
                return setTheme(value)
              }}
              type="button"
            >
              <Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
            </button>
          )
        })}
      </div>
    </Boundary>
  )
}
