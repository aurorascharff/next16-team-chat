export type Message = {
  id: string
  channelId: string
  userId: string
  userName: string
  body: string
  createdAt: string
  optimistic?: boolean
}
