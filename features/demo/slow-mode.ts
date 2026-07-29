import 'server-only'

import { cookies } from 'next/headers'

export const SLOW_COOKIE = 'huddle-slow'

export async function isSlowMode() {
  const store = await cookies()
  return store.get(SLOW_COOKIE)?.value === '1'
}
