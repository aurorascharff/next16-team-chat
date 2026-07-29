<div align="center">

<img src="public/logo.svg" alt="Patch" width="72" height="72" />

# Next 16 Messaging "Patch"

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

Patch uses SQLite locally. The checked-in setup defaults to `file:./prisma/dev.db`, so you can run:

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm dev
```

Open [http://localhost:3000/channel/ship-room](http://localhost:3000/channel/ship-room).

## Stack

- **[Next.js 16.3](https://nextjs.org/)**: App Router, Cache Components, Server Functions
- **[React 19](https://react.dev/)**: Suspense and transitions
- **[TanStack Query](https://tanstack.com/query)** for client-owned message state
- **[TypeScript](https://www.typescriptlang.org/)**

## License

[MIT](LICENSE)
