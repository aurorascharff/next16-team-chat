<div align="center">

<img src="public/logo.svg" alt="Huddle" width="72" height="72" />

# Next 16 Team Chat "Huddle"

A "Slack"-like team chat demo built with [Next.js 16.3 Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), React 19, Tailwind CSS v4, and Prisma 7. The app is available in equivalent [TanStack Query](https://tanstack.com/query) and [SWR](https://swr.vercel.app/) implementations.

[TanStack Query source →](https://github.com/aurorascharff/next16-messaging/tree/main) · [Demo →](https://next16-team-chat.vercel.app)

[SWR source →](https://github.com/aurorascharff/next16-messaging/tree/swr) · [Demo →](https://next16-team-chat-git-swr-aurora-scharffs-projects.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/skills/tree/main/skills/nextjs-app-architecture) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Client data patterns

- **Server seeded:** `MessageThread` fetches messages in a Server Component and seeds the client cache. [TanStack Query](https://github.com/aurorascharff/next16-messaging/blob/main/features/message/components/message-thread.tsx) · [SWR](https://github.com/aurorascharff/next16-messaging/blob/swr/features/message/components/message-thread.tsx)
- **Suspense query:** Mentions and replies fetch after interaction inside a local Suspense boundary. [TanStack mentions](https://github.com/aurorascharff/next16-messaging/blob/main/features/message/components/mention-combobox.tsx) · [SWR mentions](https://github.com/aurorascharff/next16-messaging/blob/swr/features/message/components/mention-combobox.tsx) · [TanStack replies](https://github.com/aurorascharff/next16-messaging/blob/main/features/message/components/thread-panel.tsx) · [SWR replies](https://github.com/aurorascharff/next16-messaging/blob/swr/features/message/components/thread-panel.tsx)
- **On demand:** `CommandPalette` fetches when it opens and renders its own pending state. [TanStack Query](https://github.com/aurorascharff/next16-messaging/blob/main/features/channel/components/command-palette.tsx) · [SWR](https://github.com/aurorascharff/next16-messaging/blob/swr/features/channel/components/command-palette.tsx)

## Features

- **[Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'`, name the data with `cacheTag`, and set its lifetime with `cacheLife`, so repeated reads come from the cache until a tag is invalidated. Per-user reads use [`'use cache: private'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache-private).
- **[Partial Prefetching](https://preview.nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches the shared channel shell as links enter the viewport, so navigation commits instantly and the message list streams in behind Suspense.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** run mutations on the server and invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag); route handlers use stale-while-revalidate [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) for read-tracking that shouldn't block the current view.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the UI interactive during server work with `Suspense`, `useOptimistic`, `useTransition`, `useActionState`, and `use`.

## Getting started

Huddle runs on Postgres, so set `DATABASE_URL` in `.env.local` and then run the following commands.

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Huddle to run locally on SQLite instead of Postgres. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/prisma-client.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped. Install `@prisma/adapter-better-sqlite3` and `better-sqlite3`, uninstall `@prisma/adapter-pg`, `pg`, and `@types/pg`. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`, then run `pnpm run prisma.push` and `pnpm run prisma.seed`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Stack

- **[Next.js 16.3](https://nextjs.org/)**: App Router, Cache Components, Server Functions
- **[React 19](https://react.dev/)** with React Compiler: Suspense, View Transitions, `useOptimistic`
- **[TanStack Query](https://tanstack.com/query)** or **[SWR](https://swr.vercel.app/)** for client-owned message state
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL (Neon)
- **[Ariakit](https://ariakit.org/)** for the accessible mention combobox

## License

[MIT](LICENSE)
