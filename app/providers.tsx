'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{}}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        {children}
      </ThemeProvider>
    </SWRConfig>
  )
}
