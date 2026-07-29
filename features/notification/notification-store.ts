const STORAGE_KEY = 'huddle:seen-sections'

export type SeenSections = Record<string, boolean>

export function readSeenSections(): SeenSections {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as SeenSections) : {}
  } catch {
    return {}
  }
}

export function writeSeenSection(href: string): SeenSections {
  const next = { ...readSeenSections(), [href]: true }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage failures
  }

  return next
}
