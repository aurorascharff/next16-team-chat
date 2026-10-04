import 'server-only'

import {
  defaultShouldDehydrateQuery,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from '@tanstack/react-query'
import { cacheLife, cacheTag } from 'next/cache'

type HydratedQuery = {
  queryKey: QueryKey
  data: unknown
}

async function getHydrationUpdatedAt(tags: string[]) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}

export async function dehydrate(
  queries: HydratedQuery[],
  { tags }: { tags: string[] },
): Promise<DehydratedState> {
  const updatedAt = await getHydrationUpdatedAt(tags)
  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, { updatedAt })
  }

  return {
    mutations: [],
    queries: queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => defaultShouldDehydrateQuery(query))
      .map((query) => ({
        dehydratedAt: updatedAt,
        queryHash: query.queryHash,
        queryKey: query.queryKey,
        state: query.state,
        ...(query.meta ? { meta: query.meta } : {}),
      })),
  }
}
