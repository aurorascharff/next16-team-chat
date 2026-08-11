'use server'

import { cookies } from 'next/headers'
import { SLOW_COOKIE } from './slow-mode'

export async function setSlowMode(enabled: boolean) {
  const store = await cookies()

  if (enabled) {
    store.set(SLOW_COOKIE, '1', { path: '/', sameSite: 'lax' })
  } else {
    store.delete(SLOW_COOKIE)
  }
}
