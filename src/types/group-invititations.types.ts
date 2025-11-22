export interface IGroupInvitation {
  id: number
  group_id: number
  email: string
  token: string
  status: 'pending' | 'accepted' | 'expired' | 'declined'
  invited_by: number
  created_at: string
  expires_at?: string | null

  group?: {
    id: number
    name: string
    description: string
  } | null

  inviter?: {
    id: number
    name: string | null
    email: string
  } | null
}
// Тип для данных запроса
export type InviteToGroupDto = {
  group_id: string
  email: string
  role: 'admin' | 'member'
}

// Тип для ответа от сервера (можно расширить по необходимости)
export type InviteToGroupResponse = {
  message: string
  token?: string
}