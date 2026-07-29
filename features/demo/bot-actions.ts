'use server'

import { updateTag } from 'next/cache'
import { addMessage } from '@/features/message/message-store'
import { messagesTag } from '@/features/message/message-queries'
import { prisma } from '@/lib/db'

const LINES = [
  'Heads up: preview deploy is green ✅',
  'Reminder to update the changelog before the release.',
  'CI finished in 42s. Nothing flaky this run.',
  'Summarized the latest thread — looks resolved.',
  'New doc draft is ready for review.',
  'Bumped the Next.js canary, build still passing.',
  'Nudge: two PRs are waiting on review.',
  'Cache warmed. Cold starts should be rare now.',
]

export async function postBotMessage() {
  const channels = await prisma.channel.findMany({ select: { id: true } })
  if (channels.length === 0) return

  const channel = channels[Math.floor(Math.random() * channels.length)]
  const body = LINES[Math.floor(Math.random() * LINES.length)]

  await addMessage({ body, channelId: channel.id, userId: 'bot' })
  updateTag(messagesTag(channel.id))
}
