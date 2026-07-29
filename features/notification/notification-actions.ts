'use server'

import { revalidatePath } from 'next/cache'
import { markSectionSeen } from './notification-store'

export async function markSectionSeenAction(href: string) {
  await markSectionSeen(href)
  revalidatePath('/', 'layout')
}
