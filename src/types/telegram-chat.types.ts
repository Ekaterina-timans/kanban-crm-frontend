import { IBase } from './root.types'

export type TgThreadType = 'private' | 'group' | 'supergroup' | 'channel' | string

export interface ITgThread extends IBase {
  group_channel_id: number
  external_chat_id: string
  external_peer_id?: string | null
  thread_type?: TgThreadType | null
  title?: string | null
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  last_update_id?: number | null
  last_message_text?: string | null
  last_message_at?: string | null
  updated_at: string
  created_at: string
}

export type TgMessageDirection = 'in' | 'out'

export interface ITgMessage extends IBase {
  channel_thread_id: number
  direction: TgMessageDirection
  external_message_id?: string | null
  external_update_id?: number | null
  sender_external_id?: string | null
  text?: string | null
  provider_date?: number | null
  payload?: any | null
  created_at: string
}

export type TgThreadsResponse = {
  data: ITgThread[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type TgMessagesResponse = {
  data: ITgMessage[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}