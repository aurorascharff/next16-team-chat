import 'server-only'

import { cookies } from 'next/headers'

export const SLOW_COOKIE = 'huddle-slow'

// Whether the demo's artificial latency is active. Read in the uncached query
// wrappers and passed into the cached functions, which can't read cookies().
export async function isSlowMode() {
  const store = await cookies()
  return store.get(SLOW_COOKIE)?.value === '1'
}
