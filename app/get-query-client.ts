import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import { QUERY_STALE_TIME } from '@/lib/query-cache-policy'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      queries: {
        staleTime: QUERY_STALE_TIME,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }

  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
