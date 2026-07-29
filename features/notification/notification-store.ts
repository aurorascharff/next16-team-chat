import 'server-only'

import { cookies } from 'next/headers'

const SEEN_COOKIE = 'huddle-seen-sections'

export type SeenSections = Record<string, boolean>

export async function readSeenSections(): Promise<SeenSections> {
  const store = await cookies()
  const raw = store.get(SEEN_COOKIE)?.value

  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw) as SeenSections
  } catch {
    return {}
  }
}

export async function markSectionSeen(href: string) {
  const store = await cookies()
  const current = await readSeenSections()

  if (current[href]) {
    return
  }

  const next = { ...current, [href]: true }
  store.set(SEEN_COOKIE, JSON.stringify(next), {
    path: '/',
    sameSite: 'lax',
  })
}
