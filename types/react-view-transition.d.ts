import type { ReactNode } from 'react'

// The stable @types/react does not yet declare <ViewTransition>, but Next.js 16
// bundles a React version that provides it. This augments the type so the
// Crossfade component compiles. See the React View Transitions API.
declare module 'react' {
  type ViewTransitionClass =
    | 'auto'
    | 'none'
    | (string & {})
    | Record<string, string>

  interface ViewTransitionProps {
    children?: ReactNode
    default?: ViewTransitionClass
    enter?: ViewTransitionClass
    exit?: ViewTransitionClass
    update?: ViewTransitionClass
    share?: ViewTransitionClass
    name?: string
  }

  export const ViewTransition: (props: ViewTransitionProps) => ReactNode
}
