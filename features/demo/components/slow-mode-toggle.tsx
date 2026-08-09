'use client'

import { Gauge } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'
import { setSlowMode } from '@/features/demo/slow-mode-actions'
import { cn } from '@/lib/utils'

export function SlowModeToggle({
  enabled,
  variant = 'pill',
}: {
  enabled: boolean
  variant?: 'icon' | 'pill'
}) {
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled)
  const [, startTransition] = useTransition()
  const iconOnly = variant === 'icon'

  return (
    <button
      aria-label="Toggle simulated network delays"
      aria-pressed={optimisticEnabled}
      className={cn(
        'flex h-8 items-center rounded-full border text-xs font-medium',
        iconOnly ? 'w-8 justify-center' : 'gap-2 px-2.5',
        optimisticEnabled
          ? 'bg-accent-fade text-accent border-transparent'
          : 'border-divider dark:border-divider-dark text-muted dark:text-muted-dark hover:text-black dark:hover:text-white',
      )}
      onClick={() => {
        startTransition(async () => {
          setOptimisticEnabled(!optimisticEnabled)
          await setSlowMode(!optimisticEnabled)
        })
      }}
      title="Simulate network delays to show loading states"
      type="button"
    >
      <Gauge aria-hidden className="size-3.5" strokeWidth={2.25} />
      {iconOnly ? null : (
        <>
          Delays
          <span
            aria-hidden
            className={cn(
              'ml-0.5 flex h-4 w-7 items-center rounded-full p-0.5',
              optimisticEnabled
                ? 'bg-accent justify-end'
                : 'bg-muted/30 justify-start',
            )}
          >
            <span className="size-3 rounded-full bg-white shadow-sm" />
          </span>
        </>
      )}
    </button>
  )
}
