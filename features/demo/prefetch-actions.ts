'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const NO_PREFETCH_COOKIE = 'no-prefetch'

export async function setPrefetchMode(enabled: boolean) {
  const store = await cookies()

  if (enabled) {
    store.delete(NO_PREFETCH_COOKIE)
  } else {
    store.set(NO_PREFETCH_COOKIE, '1', { path: '/', sameSite: 'lax' })
  }

  revalidatePath('/', 'layout')
}

export async function isPrefetchMode() {
  const store = await cookies()
  return !store.has(NO_PREFETCH_COOKIE)
}
