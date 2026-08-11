'use client'

import type { ReactNode } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'
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
        <ThemeColorSync />
        {children}
      </ThemeProvider>
    </SWRConfig>
  )
}

function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return
    const color = resolvedTheme === 'dark' ? '#0b0b0c' : '#ffffff'
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => {
        meta.content = color
      })
  }, [resolvedTheme])

  return null
}
