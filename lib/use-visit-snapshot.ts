'use client'

import { useLayoutEffect, useRef, useState } from 'react'

export function useVisitSnapshot<T>(value: T) {
  const latestValue = useRef(value)
  const reentering = useRef(false)
  const [snapshot, setSnapshot] = useState(value)

  useLayoutEffect(() => {
    latestValue.current = value
  }, [value])

  useLayoutEffect(() => {
    if (reentering.current) {
      reentering.current = false
      setSnapshot(latestValue.current)
    }

    return () => {
      reentering.current = true
    }
  }, [])

  return snapshot
}
