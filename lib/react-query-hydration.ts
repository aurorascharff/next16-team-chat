import 'server-only'

import { cacheLife } from 'next/cache'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from '@tanstack/react-query'

type HydratedQuery = {
  queryKey: QueryKey
  data: unknown
}

type HydrationOptions = {
  stale?: number
}

async function getHydrationUpdatedAt(stale: number) {
  'use cache'
  cacheLife({ stale })
  return Date.now()
}

export async function dehydrate(
  queries: HydratedQuery[],
  options: HydrationOptions = {},
): Promise<DehydratedState> {
  const updatedAt = await getHydrationUpdatedAt(options.stale ?? 30)

  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, {
      updatedAt,
    })
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
