# next16-messaging

A Next.js 16 messaging demo inspired by team chat apps. The UI calls the product **Relay** and uses rooms/messages instead of cloning Slack’s brand language.

The demo focuses on one pattern:

- Server Components seed React Query with channel messages
- React Query owns client refetch, optimistic sends, and simulated live messages
- Pages stay synchronous and compose feature components with Suspense
- Feature folders own queries, actions, components, and sibling skeletons

## Main flow

```tsx
// app/channel/[channelId]/page.tsx
export default function ChannelPage({
  params,
}: PageProps<'/channel/[channelId]'>) {
  return (
    <>
      <Suspense fallback={<ChannelHeaderSkeleton />}>
        {params.then(({ channelId }) => (
          <ChannelHeader channelId={channelId} />
        ))}
      </Suspense>
      <Suspense fallback={<MessageThreadSkeleton />}>
        {params.then(({ channelId }) => (
          <MessageThread channelId={channelId} />
        ))}
      </Suspense>
    </>
  )
}
```

```tsx
// features/message/components/message-thread.tsx
export async function MessageThread({ channelId }: { channelId: string }) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    ...messagesQueryOptions(channelId),
    queryFn: () => getMessages(channelId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessageList channelId={channelId} />
      <MessageComposer channelId={channelId} />
    </HydrationBoundary>
  )
}
```

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000/channel/general](http://localhost:3000/channel/general).
