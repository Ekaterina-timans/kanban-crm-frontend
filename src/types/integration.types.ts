import { IBase } from './root.types'

export type ChannelProvider = 'telegram' | string
export type ChannelStatus = 'active' | 'disabled' | 'error'

export interface IGroupChannel extends IBase {
  group_id: number
  provider: ChannelProvider
  display_name: string
  status: ChannelStatus
  settings?: any | null
}

export type TelegramConnectPayload = {
  bot_token: string
}

export type TelegramBotInfo = {
  bot_id?: number | null
  bot_username?: string | null
  bot_name?: string | null
  last_update_id?: number | null
}
