export type MessageStatus = 'sending' | 'sent' | 'failed'

export type Message = {
  id: string
  channelId: string
  userId: string
  userName: string
  body: string
  createdAt: string
  parentId?: string | null
  replyCount?: number
  status?: MessageStatus
}
