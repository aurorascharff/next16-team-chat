<div align="center">

<img src="public/logo.svg" alt="Huddle" width="72" height="72" />

# Next 16 Messaging "Huddle"

A developer workspace chat app that demonstrates [Instant Navigations](https://preview.nextjs.org/docs/app/guides/instant-navigation) in the [Next.js 16.3 preview](https://nextjs.org/blog/next-16-3-instant-navigations).

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/skills/tree/main/skills/nextjs-app-architecture) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache room metadata and message reads with `cacheTag` and `cacheLife`. Per-user reads use [`'use cache: private'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache-private).
- **[Partial Prefetching](https://preview.nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches the shared room shell as links enter the viewport, so navigation commits instantly and messages stream behind Suspense.
- **[React Query](https://tanstack.com/query)** receives a server-seeded message cache from `<HydrationBoundary>`, then owns client refetching and optimistic sends.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** send messages on the server and invalidate the affected message tag with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag).
- **Async React** keeps the UI interactive during server work with `Suspense`, `useTransition`, and optimistic client cache updates.

## Getting started

Huddle runs on Postgres, so set `DATABASE_URL` in `.env.local` and then run the following commands.

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000/channel/ship-room](http://localhost:3000/channel/ship-room) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Huddle to run locally on SQLite instead of Postgres. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/prisma-client.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped. Install `@prisma/adapter-better-sqlite3` and `better-sqlite3`, uninstall `@prisma/adapter-pg`, `pg`, and `@types/pg`. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`, then run `pnpm run prisma.push` and `pnpm run prisma.seed`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Stack

- **[Next.js 16.3](https://nextjs.org/)**: App Router, Cache Components, Server Functions
- **[React 19](https://react.dev/)**: Suspense and transitions
- **[TanStack Query](https://tanstack.com/query)** for client-owned message state
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL (Neon)

## License

[MIT](LICENSE)
