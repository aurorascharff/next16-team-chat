import { ViewTransition } from 'react'

export function Crossfade({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" enter="auto">
      {children}
    </ViewTransition>
  )
}
