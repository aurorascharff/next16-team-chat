import { queryOptions } from '@tanstack/react-query'
import { readSeenSections, type SeenSections } from './notification-store'

export const notificationKeys = {
  seenSections: ['notifications', 'seen-sections'] as const,
}

export function seenSectionsQueryOptions() {
  return queryOptions({
    queryFn: (): SeenSections => {
      return readSeenSections()
    },
    queryKey: notificationKeys.seenSections,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
