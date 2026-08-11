'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NO_PREFETCH_COOKIE } from './demo-queries'

export async function setPrefetchMode(enabled: boolean) {
  const store = await cookies()

  if (enabled) {
    store.delete(NO_PREFETCH_COOKIE)
  } else {
    store.set(NO_PREFETCH_COOKIE, '1', { path: '/', sameSite: 'lax' })
  }

  revalidatePath('/', 'layout')
}
