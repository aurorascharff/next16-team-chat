/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client'

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const sqliteUrl = databaseUrl.startsWith('file:')
  ? databaseUrl.slice('file:'.length)
  : databaseUrl
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: sqliteUrl }),
})

const users = [
  { handle: 'aurora', id: 'ada', name: 'Aurora', role: 'DX engineering' },
  { handle: 'mira', id: 'grace', name: 'Mira', role: 'AI tools' },
  { handle: 'nico', id: 'nico', name: 'Nico', role: 'Frontend' },
]

const channels = [
  {
    description: 'Daily build notes, release work, and review handoffs.',
    handoff: 'Finish the demo shell, verify Cache Components, then update the README.',
    id: 'ship-room',
    name: 'ship-room',
    pinned: ['Build green', 'React Query seed', 'Mobile layout'],
    status: 'Shipping',
    unread: 3,
  },
  {
    description: 'Agent traces, eval notes, and prompt fixes.',
    handoff: 'Tighten the skill around sync pages, id props, and cache seed examples.',
    id: 'ai-tools',
    isPrivate: true,
    name: 'ai-tools',
    pinned: ['App architecture audit', 'Agent eval notes', 'Prompt diffs'],
    status: 'Auditing',
    unread: 2,
  },
  {
    description: 'Screenshots, interaction polish, and mobile pass.',
    handoff: 'Check header CLS, mobile channel strip, and message density.',
    id: 'design-review',
    name: 'design-review',
    pinned: ['Mobile pass', 'Sidebar polish', 'Composer states'],
    status: 'Polish pass',
  },
  {
    description: 'Prefetch costs, route shells, and navigation traces.',
    handoff: 'Document the full-prefetch cost without duplicating the guide.',
    id: 'runtime-prefetch',
    name: 'runtime-prefetch',
    pinned: ['Runtime guide', 'Partial prefetch audit', 'Instant tests'],
    status: 'Research',
  },
  {
    description: 'Release notes, comments, and final blog post copy.',
    handoff: 'Keep the upgrade guide source-led and remove stale MCP language.',
    id: 'release-post',
    name: 'release-post',
    pinned: ['Joseph comments', 'AI agents section', 'Migration prompt'],
    status: 'Writing',
    unread: 1,
  },
  {
    description: 'Dev server health, deploy checks, and flaky CI.',
    handoff: 'Watch preview build output and keep the dev server clean.',
    id: 'infra',
    name: 'infra',
    pinned: ['CI status', 'Deploy notes', 'Package warnings'],
    status: 'Green',
  },
  {
    description: 'A blank room for notes that are not ready for a thread.',
    handoff: 'Use this room for loose notes before they become a thread.',
    id: 'scratch',
    name: 'scratch',
    pinned: ['Draft notes', 'Ideas'],
    status: 'Quiet',
  },
]

const messages = [
  ['m-1', 'ship-room', 'ada', 'I found the Date.now warning. It was coming from React Query dehydration, not the seed data.', '2026-07-29T13:00:00.000Z'],
  ['m-2', 'ship-room', 'grace', 'Nice. Cache the server seed and keep the optimistic send on the client?', '2026-07-29T13:02:00.000Z'],
  ['m-3', 'ship-room', 'ada', 'Yep. The page stays sync, the feature gets the channel id, and the message query owns the cached read.', '2026-07-29T13:04:00.000Z'],
  ['m-4', 'ship-room', 'grace', 'I also want the skeleton to match the header height exactly. The little jump is visible on slow refresh.', '2026-07-29T13:07:00.000Z'],
  ['m-5', 'ship-room', 'ada', 'Going through mobile now. The channel rail should turn into a compact strip, not a second page header.', '2026-07-29T13:10:00.000Z'],
  ['m-6', 'ai-tools', 'grace', 'The agent kept trying to pass promises through the page. I added the example where the page stays sync and the feature receives the id.', '2026-07-29T13:05:00.000Z'],
  ['m-7', 'ai-tools', 'ada', 'We should add an eval for this. It catches the same mistake in app architecture and Cache Components work.', '2026-07-29T13:11:00.000Z'],
  ['m-8', 'runtime-prefetch', 'ada', 'The hover case is separate. The costly path here is full runtime prefetch on every visible link.', '2026-07-29T13:03:00.000Z'],
  ['m-9', 'runtime-prefetch', 'grace', 'I linked the runtime prefetching guide and kept the warning short. No need to copy the docs into the skill.', '2026-07-29T13:06:00.000Z'],
  ['m-10', 'design-review', 'ada', 'The sidebar is closer, but the header fallback still needs to match the final height so we do not get a tiny jump.', '2026-07-29T13:08:00.000Z'],
  ['m-11', 'design-review', 'grace', 'Keep the blue for active states only. The hash itself should just feel like navigation.', '2026-07-29T13:12:00.000Z'],
  ['m-12', 'release-post', 'grace', 'Joseph replied on the post. I moved the migration prompt below the setup path so it reads in order.', '2026-07-29T13:01:00.000Z'],
  ['m-13', 'infra', 'ada', 'Build is green after the Next preview bump. The only warning left is the local npmrc env placeholder.', '2026-07-29T13:09:00.000Z'],
] as const

async function main() {
  await prisma.message.deleteMany()
  await prisma.pinnedItem.deleteMany()
  await prisma.channelMember.deleteMany()
  await prisma.channel.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({ data: users })

  for (const channel of channels) {
    await prisma.channel.create({
      data: {
        description: channel.description,
        handoff: channel.handoff,
        id: channel.id,
        isPrivate: channel.isPrivate ?? false,
        members: {
          createMany: {
            data: users.map((user) => ({ userId: user.id })),
          },
        },
        name: channel.name,
        pinned: {
          createMany: {
            data: channel.pinned.map((label, index) => ({
              id: `${channel.id}-pin-${index + 1}`,
              label,
            })),
          },
        },
        status: channel.status,
        unread: channel.unread ?? 0,
      },
    })
  }

  await prisma.message.createMany({
    data: messages.map(([id, channelId, userId, body, createdAt]) => ({
      body,
      channelId,
      createdAt: new Date(createdAt),
      id,
      userId,
    })),
  })

  console.log('Seeded Patch workspace')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
