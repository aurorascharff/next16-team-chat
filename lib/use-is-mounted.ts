'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
