import 'server-only'

import { cookies } from 'next/headers'

export const SLOW_COOKIE = 'huddle-slow'

// Artificial latency is opt-in. Read the cookie in uncached query wrappers and
// pass the result into cached functions so request data becomes part of the key.
export async function isSlowMode() {
  return (await cookies()).has(SLOW_COOKIE)
}
