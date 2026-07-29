'use client'

import { Search } from 'lucide-react'

export function SearchButton() {
  return (
    <button
      className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark text-muted dark:text-muted-dark flex h-9 w-full items-center gap-2.5 rounded-lg border px-3 text-sm transition-colors hover:text-black dark:hover:text-white"
      onClick={() => {
        window.dispatchEvent(new Event('open-command-palette'))
      }}
      type="button"
    >
      <Search aria-hidden className="size-4 shrink-0" strokeWidth={2} />
      <span className="flex-1 text-left">Search Huddle</span>
      <kbd className="border-divider dark:border-divider-dark text-muted dark:text-muted-dark flex h-5 items-center gap-0.5 rounded border px-1.5 font-sans text-xs">
        <span className="text-sm leading-none">⌘</span>K
      </kbd>
    </button>
  )
}
