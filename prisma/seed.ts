/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const users = [
  { handle: 'aurora', id: 'ada', name: 'Aurora', role: 'DX engineering' },
  { handle: 'mira', id: 'grace', name: 'Mira', role: 'AI tools' },
  { handle: 'nico', id: 'nico', name: 'Nico', role: 'Frontend' },
]

const channels = [
  {
    category: 'Projects',
    description: 'Daily build notes, release work, and review handoffs.',
    handoff:
      'Finish the demo shell, verify Cache Components, then update the README.',
    id: 'proj-ship-room',
    name: 'proj-ship-room',
    pinned: ['Build green', 'React Query seed', 'Mobile layout'],
    status: 'Shipping',
    unread: 3,
  },
  {
    category: 'Projects',
    description: 'Agent traces, eval notes, and prompt fixes.',
    handoff:
      'Tighten the skill around sync pages, id props, and cache seed examples.',
    id: 'proj-ai-tools',
    isPrivate: true,
    name: 'proj-ai-tools',
    pinned: ['App architecture audit', 'Agent eval notes', 'Prompt diffs'],
    status: 'Auditing',
    unread: 2,
  },
  {
    category: 'Projects',
    description: 'Screenshots, interaction polish, and mobile pass.',
    handoff: 'Check header CLS, mobile channel strip, and message density.',
    id: 'proj-design',
    name: 'proj-design',
    pinned: ['Mobile pass', 'Sidebar polish', 'Composer states'],
    status: 'Polish pass',
  },
  {
    category: 'Coordination',
    description: 'Prefetch costs, route shells, and navigation traces.',
    handoff: 'Document the full-prefetch cost without duplicating the guide.',
    id: 'coord-prefetch',
    name: 'coord-prefetch',
    pinned: ['Runtime guide', 'Partial prefetch audit', 'Instant tests'],
    status: 'Research',
  },
  {
    category: 'Coordination',
    description: 'Release notes, comments, and final blog post copy.',
    handoff: 'Keep the upgrade guide source-led and remove stale MCP language.',
    id: 'coord-releases',
    name: 'coord-releases',
    pinned: ['Joseph comments', 'AI agents section', 'Migration prompt'],
    status: 'Writing',
    unread: 1,
  },
  {
    category: 'Coordination',
    description: 'Dev server health, deploy checks, and flaky CI.',
    handoff: 'Watch preview build output and keep the dev server clean.',
    id: 'coord-infra',
    name: 'coord-infra',
    pinned: ['CI status', 'Deploy notes', 'Package warnings'],
    status: 'Green',
  },
  {
    category: 'Random',
    description: 'Loose notes and things not ready for a real thread.',
    handoff: 'Use this room for loose notes before they become a thread.',
    id: 'random-watercooler',
    name: 'random-watercooler',
    pinned: ['Draft notes', 'Ideas'],
    status: 'Quiet',
  },
  {
    category: 'Random',
    description: 'Groan-worthy jokes. Posting is mandatory, laughing is not.',
    handoff: 'Rotate whose turn it is to post the daily groaner.',
    id: 'random-dad-jokes',
    name: 'random-dad-jokes',
    pinned: ['Pun of the week', 'Hall of groans'],
    status: 'Punny',
  },
  {
    category: 'Random',
    description: 'Explain your bug out loud. The duck is always listening.',
    handoff: 'If the duck solved it, write down what you learned.',
    id: 'random-rubber-ducks',
    name: 'random-rubber-ducks',
    pinned: ['Duck of the day', 'Solved-by-quacking log'],
    status: 'Quack',
  },
  {
    category: 'Random',
    description: 'Spicy opinions about tabs, semicolons, and CSS-in-JS.',
    handoff: 'Keep it playful. No takes get shipped to production.',
    id: 'random-hot-takes',
    name: 'random-hot-takes',
    pinned: ['Tabs vs spaces', 'Is CSS a language'],
    status: 'Spicy',
  },
]

const messages = [
  [
    'm-1',
    'proj-ship-room',
    'ada',
    'I found the Date.now warning. It was coming from React Query dehydration, not the seed data.',
    '2026-07-29T13:00:00.000Z',
  ],
  [
    'm-2',
    'proj-ship-room',
    'grace',
    'Nice. Cache the server seed and keep the optimistic send on the client?',
    '2026-07-29T13:02:00.000Z',
  ],
  [
    'm-3',
    'proj-ship-room',
    'ada',
    'Yep. The page stays sync, the feature gets the channel id, and the message query owns the cached read.',
    '2026-07-29T13:04:00.000Z',
  ],
  [
    'm-4',
    'proj-ship-room',
    'grace',
    'I also want the skeleton to match the header height exactly. The little jump is visible on slow refresh.',
    '2026-07-29T13:07:00.000Z',
  ],
  [
    'm-5',
    'proj-ship-room',
    'ada',
    'Going through mobile now. The channel rail should turn into a compact strip, not a second page header.',
    '2026-07-29T13:10:00.000Z',
  ],
  [
    'm-6',
    'proj-ai-tools',
    'grace',
    'The agent kept trying to pass promises through the page. I added the example where the page stays sync and the feature receives the id.',
    '2026-07-29T13:05:00.000Z',
  ],
  [
    'm-7',
    'proj-ai-tools',
    'ada',
    'We should add an eval for this. It catches the same mistake in app architecture and Cache Components work.',
    '2026-07-29T13:11:00.000Z',
  ],
  [
    'm-8',
    'coord-prefetch',
    'ada',
    'The hover case is separate. The costly path here is full runtime prefetch on every visible link.',
    '2026-07-29T13:03:00.000Z',
  ],
  [
    'm-9',
    'coord-prefetch',
    'grace',
    'I linked the runtime prefetching guide and kept the warning short. No need to copy the docs into the skill.',
    '2026-07-29T13:06:00.000Z',
  ],
  [
    'm-10',
    'proj-design',
    'ada',
    'The sidebar is closer, but the header fallback still needs to match the final height so we do not get a tiny jump.',
    '2026-07-29T13:08:00.000Z',
  ],
  [
    'm-11',
    'proj-design',
    'grace',
    'Keep the blue for active states only. The hash itself should just feel like navigation.',
    '2026-07-29T13:12:00.000Z',
  ],
  [
    'm-12',
    'coord-releases',
    'grace',
    'Joseph replied on the post. I moved the migration prompt below the setup path so it reads in order.',
    '2026-07-29T13:01:00.000Z',
  ],
  [
    'm-13',
    'coord-infra',
    'ada',
    'Build is green after the Next preview bump. The only warning left is the local npmrc env placeholder.',
    '2026-07-29T13:09:00.000Z',
  ],
  [
    'm-14',
    'random-dad-jokes',
    'nico',
    'Why do React devs prefer dark mode? Because light attracts bugs.',
    '2026-07-29T13:13:00.000Z',
  ],
  [
    'm-15',
    'random-rubber-ducks',
    'nico',
    'Explained my hydration bug to the duck. Turns out it was a Date.now in render. The duck knew all along.',
    '2026-07-29T13:14:00.000Z',
  ],
  [
    'm-16',
    'random-hot-takes',
    'grace',
    'Hot take: the best loading state is one you never see because the navigation was instant.',
    '2026-07-29T13:15:00.000Z',
  ],
  // Threaded replies (6th element is the parent message id).
  [
    'm-1-r1',
    'proj-ship-room',
    'grace',
    'Good catch. Was it the initialData or the queryFn firing on the server?',
    '2026-07-29T13:01:30.000Z',
    'm-1',
  ],
  [
    'm-1-r2',
    'proj-ship-room',
    'ada',
    'The queryFn. Pinning staleTime fixed it.',
    '2026-07-29T13:02:30.000Z',
    'm-1',
  ],
  [
    'm-4-r1',
    'proj-ship-room',
    'ada',
    'Fixed. The skeleton now pins the h1 and p line-boxes so it is exactly 75px.',
    '2026-07-29T13:08:30.000Z',
    'm-4',
  ],
  [
    'm-14-r1',
    'random-dad-jokes',
    'ada',
    'I groaned so loud the CI pipeline failed in sympathy.',
    '2026-07-29T13:13:30.000Z',
    'm-14',
  ],
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
        category: channel.category,
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
    data: messages.map(
      ([id, channelId, userId, body, createdAt, parentId]) => ({
        body,
        channelId,
        createdAt: new Date(createdAt),
        id,
        parentId: parentId ?? null,
        userId,
      }),
    ),
  })

  console.log('Seeded Huddle workspace')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
