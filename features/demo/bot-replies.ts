import 'server-only'

import { createGateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'
import { addMessage, parseMentions } from '@/features/message/message-queries'
import { getUsers } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'

const GENERATION_FAILED_REPLY =
  "I couldn't reach the AI service just now. Try mentioning me again in a moment."

const gateway = process.env.VERCEL_AI_GATEWAY_TOKEN
  ? createGateway({ apiKey: process.env.VERCEL_AI_GATEWAY_TOKEN })
  : null

async function generateBotReply({
  body,
  channelId,
  parentId,
}: {
  body: string
  channelId: string
  parentId?: string
}) {
  const [channel, thread] = await Promise.all([
    prisma.channel.findUnique({
      select: {
        description: true,
        name: true,
        messages: {
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          select: { body: true, user: { select: { name: true } } },
          take: 8,
          where: { parentId: null },
        },
      },
      where: { id: channelId },
    }),
    parentId
      ? prisma.message.findUnique({
          select: {
            body: true,
            replies: {
              orderBy: { createdAt: 'asc' },
              select: { body: true, user: { select: { name: true } } },
              take: 12,
            },
            user: { select: { name: true } },
          },
          where: { id: parentId },
        })
      : null,
  ])

  const conversation = thread
    ? [
        `${thread.user.name}: ${thread.body}`,
        ...thread.replies.map((reply) => {
          return `${reply.user.name}: ${reply.body}`
        }),
      ]
    : (channel?.messages ?? [])
        .reverse()
        .map((message) => `${message.user.name}: ${message.body}`)

  try {
    const { text } = await generateText({
      instructions: [
        'You are Huddle Bot, a concise and helpful teammate in a demo team chat.',
        'Reply directly to the newest message using only the supplied conversation context.',
        'Do not invent repository, deployment, or project facts that are not in the context.',
        'Use one to three short sentences with no heading or preamble.',
      ].join(' '),
      maxOutputTokens: 120,
      model:
        gateway?.languageModel('google/gemini-2.5-flash-lite') ??
        'google/gemini-2.5-flash-lite',
      prompt: [
        `Channel: #${channel?.name ?? channelId}`,
        channel?.description ? `Description: ${channel.description}` : '',
        'Recent conversation:',
        conversation.join('\n'),
        `Newest message: ${body}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
      timeout: 5_000,
    })

    const reply = text.trim()
    if (reply) return reply
  } catch (error) {
    console.error('Huddle Bot generation failed', error)
  }

  return GENERATION_FAILED_REPLY
}

export async function replyAsBotIfMentioned({
  authorId,
  body,
  channelId,
  messageId,
  parentId,
}: {
  authorId: string
  body: string
  channelId: string
  messageId: string
  parentId?: string
}): Promise<string | null> {
  if (authorId === 'bot') return null
  const users = await getUsers()
  if (!parseMentions(body, users).includes('bot')) return null

  const threadParent = parentId ?? messageId
  const reply = await generateBotReply({ body, channelId, parentId })

  await addMessage({
    body: reply,
    channelId,
    parentId: threadParent,
    userId: 'bot',
  })

  return threadParent
}
