'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { useOffline } from 'next/offline'
import { setSimulatedOffline } from '@/features/demo/offline-mode'
import { cn } from '@/lib/utils'

export function OfflineToggle() {
  const offline = useOffline()

  return (
    <button
      aria-label={offline ? 'Simulating offline' : 'Online'}
      aria-pressed={offline}
      className={cn(
        'flex min-h-8 items-center gap-2 rounded-full border px-2.5 text-xs font-medium',
        offline
          ? 'border-transparent bg-red-500/10 text-red-600 dark:text-red-400'
          : 'border-divider dark:border-divider-dark text-muted dark:text-muted-dark hover:text-black dark:hover:text-white',
      )}
      onClick={() => setSimulatedOffline(!offline)}
      title="Simulate an offline browser"
      type="button"
    >
      {offline ? (
        <WifiOff aria-hidden className="size-3.5" strokeWidth={2.25} />
      ) : (
        <Wifi aria-hidden className="size-3.5" strokeWidth={2.25} />
      )}
      {offline ? 'Offline' : 'Online'}
    </button>
  )
}
