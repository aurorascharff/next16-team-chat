'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationKeys } from './notification-query-options'
import { writeSeenSection, type SeenSections } from './notification-store'

export function useMarkSectionSeen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (href: string): Promise<SeenSections> => {
      return writeSeenSection(href)
    },
    onSuccess: (seen) => {
      queryClient.setQueryData(notificationKeys.seenSections, seen)
    },
  })
}
