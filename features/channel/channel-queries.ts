import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { isSlowMode } from '@/features/demo/slow-mode'
import { getCurrentUser } from '@/features/user/user-queries'
import { prisma } from '@/lib/db'
import { delay } from '@/lib/utils'

export const UNGROUPED = 'Channels'

export type ChannelSummary = {
  id: string
  name: string
  description: string
  group: string
  isPrivate: boolean
  memberCount: number
  unread?: number
}

export type ChannelDetail = ChannelSummary & {
  handoff: string
  members: string[]
  pinned: string[]
  status: string
  messageCount: number
}

type ChannelRow = {
  id: string
  name: string
  description: string
  isPrivate: boolean
  unread: number
  members?: unknown[]
}

function toChannelSummary(
  channel: ChannelRow,
  group = UNGROUPED,
): ChannelSummary {
  return {
    description: channel.description,
    group,
    id: channel.id,
    isPrivate: channel.isPrivate,
    memberCount: channel.members?.length ?? 0,
    name: channel.name,
    unread: channel.unread || undefined,
  }
}

async function listChannels(userId: string) {
  const memberships = await prisma.channelMember.findMany({
    include: {
      channel: { include: { members: true } },
      group: true,
    },
    where: { userId },
  })

  return memberships
    .map((membership) => {
      return {
        ...toChannelSummary(
          membership.channel,
          membership.group?.name ?? UNGROUPED,
        ),
        groupId: membership.groupId,
        groupPosition: membership.group?.position ?? Number.MAX_SAFE_INTEGER,
        position: membership.position,
      }
    })
    .sort((a, b) => {
      return (
        a.groupPosition - b.groupPosition ||
        a.position - b.position ||
        a.name.localeCompare(b.name)
      )
    })
}

async function listChannelLayout(userId: string) {
  const [groups, channels] = await Promise.all([
    prisma.channelGroup.findMany({
      orderBy: { name: 'asc' },
      where: { userId },
    }),
    listChannels(userId),
  ])

  const layout = groups.map((group) => {
    return {
      channels: channels.filter((channel) => channel.groupId === group.id),
      name: group.name,
    }
  })

  const ungrouped = channels.filter((channel) => !channel.groupId)
  if (ungrouped.length > 0) {
    layout.push({ channels: ungrouped, name: UNGROUPED })
  }

  return layout
}

export function channelTag(channelId: string) {
  return `channel:${channelId}`
}

export async function getChannelLayout() {
  const user = await getCurrentUser()
  return getChannelLayoutCached(user.id, await isSlowMode())
}

export async function listChannelsForUser(userId: string) {
  'use cache'
  cacheTag('channels', `channels:${userId}`)
  cacheLife('hours')
  return listChannels(userId)
}

export async function getUnreadChannels() {
  const channels = await prisma.channel.findMany({
    select: { id: true, unread: true },
    where: { unread: { gt: 0 } },
  })

  return Object.fromEntries(
    channels.map((channel) => {
      return [channel.id, channel.unread]
    }),
  ) as Record<string, number>
}

async function getChannelLayoutCached(userId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', `channels:${userId}`)
  cacheLife('hours')
  await delay(400, slow)
  return listChannelLayout(userId)
}

export async function getChannel(channelId: string) {
  const user = await getCurrentUser()
  return getChannelForUser(channelId, user.id)
}

async function getChannelForUser(channelId: string, userId: string) {
  const channels = await listChannelsForUser(userId)
  const channel = channels.find((entry) => entry.id === channelId)
  if (!channel) notFound()
  return channel
}

export async function getChannelDetails(channelId: string) {
  return getChannelDetailsCached(channelId, await isSlowMode())
}

async function getChannelDetailsCached(channelId: string, slow: boolean) {
  'use cache'
  cacheTag('channels', channelTag(channelId))
  cacheLife('hours')
  await delay(900, slow)
  const channel = await loadChannelDetail(channelId)
  if (!channel) notFound()
  return channel
}

async function loadChannelDetail(channelId: string) {
  const channel = await prisma.channel.findUnique({
    include: {
      members: { include: { user: true } },
      pinned: { orderBy: { id: 'asc' } },
    },
    where: { id: channelId },
  })

  if (!channel) return null

  const messageCount = await prisma.message.count({
    where: { channelId, parentId: null },
  })

  return {
    ...toChannelSummary(channel),
    handoff: channel.handoff,
    members: channel.members.map((member) => member.user.name),
    messageCount,
    pinned: channel.pinned.map((item) => item.label),
    status: channel.status,
  } satisfies ChannelDetail
}

export async function searchChannels(userId: string) {
  return listChannels(userId)
}

export async function markChannelRead(channelId: string, userId: string) {
  const channelUpdate = await prisma.channel.updateMany({
    data: { unread: 0 },
    where: { id: channelId, unread: { gt: 0 } },
  })

  if (channelUpdate.count === 0) {
    return false
  }

  await prisma.channelMember.updateMany({
    data: { lastReadAt: new Date() },
    where: { channelId, userId },
  })
  return true
}

export function lastReadTag(channelId: string, userId: string) {
  return `last-read:${channelId}:${userId}`
}

export async function getLastReadAt(channelId: string, userId: string) {
  'use cache: private'
  cacheTag(lastReadTag(channelId, userId))
  cacheLife({ stale: 60 })

  const member = await prisma.channelMember.findUnique({
    select: { lastReadAt: true },
    where: { channelId_userId: { channelId, userId } },
  })
  return member?.lastReadAt?.toISOString() ?? null
}

export async function reorderChannels(
  userId: string,
  layout: { groups: { name: string; channelIds: string[] }[] },
) {
  const existingGroups = await prisma.channelGroup.findMany({
    where: { userId },
  })
  const groupIdByName = new Map(
    existingGroups.map((group) => [group.name, group.id]),
  )
  const keptNames = new Set(
    layout.groups
      .map((group) => group.name)
      .filter((name) => name !== UNGROUPED),
  )

  await prisma.$transaction(async (tx) => {
    const removed = existingGroups.filter((group) => !keptNames.has(group.name))
    if (removed.length > 0) {
      await tx.channelGroup.deleteMany({
        where: { id: { in: removed.map((group) => group.id) } },
      })
    }

    for (const [position, group] of layout.groups.entries()) {
      const ungrouped = group.name === UNGROUPED
      let groupId = ungrouped ? null : (groupIdByName.get(group.name) ?? null)

      if (!ungrouped && !groupId) {
        groupId = `${userId}-group-${crypto.randomUUID()}`
        await tx.channelGroup.create({
          data: { id: groupId, name: group.name, position, userId },
        })
        groupIdByName.set(group.name, groupId)
      } else if (!ungrouped && groupId) {
        await tx.channelGroup.update({
          data: { position },
          where: { id: groupId },
        })
      }

      for (const [channelPosition, channelId] of group.channelIds.entries()) {
        await tx.channelMember.update({
          data: { groupId, position: channelPosition },
          where: { channelId_userId: { channelId, userId } },
        })
      }
    }
  })
}
