import { IBase } from "./root.types"
import { IUser } from "./user.types"

export interface IAttachment extends IBase {
  original_name: string
  mime?: string | null
  size?: number | null
  url?: string | null
  download_url?: string | null
}

export interface IMessage extends IBase {
  chat_id: number | string
  user_id: number | string
  content?: string | null
  kind: 'text' | 'system' | 'poll'
  reply_to_id?: number | null
  created_at: string
  user?: IUser
  replyTo?: {
    id: number
    chat_id: number | string
    user_id: number | string
    content?: string | null
    user?: IUser
  } | null
  meta?: {
    mentions?: Array<{ id: number | string; name?: string | null; email?: string }>
    [k: string]: any
  }
  attachments?: IAttachment[]
  mentioned_users?: Array<{
    id: number | string
    email: string
    name?: string | null
    avatar?: string | null
  }>
}