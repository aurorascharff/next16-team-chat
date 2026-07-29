'use server'

import { updateTag } from 'next/cache'
import { addMessage, messagesTag } from '@/features/message/message-queries'
import { prisma } from '@/lib/db'

const LINES_BY_CHANNEL: Record<string, string[]> = {
  'coord-infra': [
    '**Deploy report** — `main` → production\n- Build passed in 42s, 0 flaky tests\n- Bundle size: 214 kB (−3 kB)\n- Cold starts down 18% after cache warming',
    '**CI summary (last 24h)**\n- 37 runs, 35 green, 2 retried\n- Slowest job: e2e at 2m14s\n- No new package warnings',
    '**Incident update** — preview build warning\n- Root cause: stale lockfile entry\n- Fix merged in `chore/lockfile-sync`\n- Preview builds green again',
  ],
  'coord-releases': [
    '**Release digest** — v16.3 notes\n- Migration prompt draft ready for review\n- Joseph’s comments folded into the AI agents section\n- Stale MCP language removed from the upgrade guide\n\n@Aurora can you take the final pass?',
    '**Changelog summary** since last tag\n- 12 commits, 4 features, 6 fixes\n- Highlight: shared-cache channel header\n- Blocker: none\n\n@Mira ready for copy edit.',
    '**Docs status**\n- Upgrade guide: source-led, 90% done\n- Blog post: outline approved\n- Screenshots: pending mobile pass',
  ],
  'proj-ai-tools': [
    '**Agent eval report**\n- Pass rate 94% (+6 pts after prompt fix)\n- Traces cleaner, fewer retries\n- Regression: none\n\n@Mira audit notes are in the thread.',
    '**Repo update** — `next16-app-architecture` skill\n- Tightened sync-page + id-prop guidance\n- Added cache-seed example\n- PR #128 up for review',
    '**Prompt diff summary**\n- 3 prompts updated, 1 removed\n- Token use −22% on the audit flow\n\n@Aurora mind a look before I merge?',
  ],
  'proj-ship-room': [
    '**Ship status** — demo shell\n- Build green, Cache Components verified\n- No render waterfalls on channel routes\n- Mobile layout pass merged\n\n@Mira ready for a look.',
    '**Repo update** — `main`\n- 5 commits since standup\n- README updated with new seed steps\n- Next up: composer preview polish',
    '**QA summary**\n- Desktop: pass\n- Mobile: composer needs a small-screen check\n\n@Nico can you verify?',
  ],
  'team-design': [
    '**Design QA report**\n- Header CLS resolved after shared-cache change\n- Sidebar unread dots calmer\n- Message density tightened\n\n@Nico nice catch on the header.',
    '**Polish summary**\n- Composer states reviewed\n- Mobile channel strip aligned\n- Remaining: empty-state copy\n\n@Aurora states are in the thread.',
    '**Repo update** — `feat/sidebar-polish`\n- 3 commits, ready to merge\n- Before/after screenshots attached in thread',
  ],
  'team-frontend': [
    '**Perf report** — prefetch audit\n- Full-prefetch cost documented (no guide dupes)\n- Partial-prefetch numbers in the thread\n- Instant-nav tests passing on all channel routes\n\n@Aurora numbers are ready.',
    '**Route-shell summary**\n- Static shells prerendering cleanly\n- No client waterfalls detected\n- Follow-up: document the trace method\n\n@Mira want to pair on the writeup?',
    '**Repo update** — `main`\n- Navigation traces cleaned up\n- 4 commits since last sync',
  ],
  'random-watercooler': [
    'Coffee’s on. Anyone pairing this afternoon?',
    'Quiet in here — drop your loose notes before they become a thread.',
    'Reminder: standup moved 15 minutes later today.',
  ],
  'random-dad-jokes': [
    'Why do programmers prefer dark mode? Because light attracts bugs.',
    'I would tell you a UDP joke, but you might not get it.',
    'It’s your turn to post the daily groaner. No pressure.',
  ],
  'random-rubber-ducks': [
    'The duck is listening. Explain the bug out loud.',
    'If quacking solved it, write down what you learned.',
    'Stuck? Rubber-duck it here before opening a thread.',
  ],
  'random-hot-takes': [
    'Tabs vs spaces is settled. (It is not. Discuss.)',
    'Hot take: no take ships to production. Keep it playful.',
    'Is CSS a programming language? Answers on a postcard.',
  ],
}

const GENERIC = [
  '**Daily summary**\n- 2 PRs awaiting review\n- 1 thread resolved\n- Changelog up to date',
  '**Repo update** — `main`\n- No new failures\n- Everything green since the last deploy',
]

export async function postBotMessage() {
  const channels = await prisma.channel.findMany({ select: { id: true } })
  if (channels.length === 0) return

  const channel = channels[Math.floor(Math.random() * channels.length)]
  const lines = LINES_BY_CHANNEL[channel.id] ?? GENERIC
  const body = lines[Math.floor(Math.random() * lines.length)]

  await addMessage({ body, channelId: channel.id, userId: 'bot' })
  await prisma.channel.update({
    data: { unread: { increment: 1 } },
    where: { id: channel.id },
  })
  updateTag(messagesTag(channel.id))
}
