export type MessageStatus = 'sending' | 'sent' | 'failed'

export type Reaction = {
  emoji: string
  count: number
  reacted: boolean
  users: string[]
}

export type Message = {
  id: string
  channelId: string
  userId: string
  userName: string
  body: string
  createdAt: string
  parentId?: string | null
  replyCount?: number
  reactions?: Reaction[]
  status?: MessageStatus
}
