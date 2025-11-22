import { IBase } from './root.types'

export type ChatType = 'group' | 'direct'

export interface IChat extends IBase {
	type: ChatType
	title: string
	avatar: string | null
	unread_count: number
	last_message_id?: number | null
	last_message?: string | null
	last_message_at?: string | null
	participants_count?: number
}

export type ChatRole = 'owner' | 'admin' | 'member'

export type ChatParticipant = {
	id: number | string
	name?: string | null
	email: string
	avatar?: string | null
	role: ChatRole
}

export type ParticipantsResponse = {
	my_role: ChatRole
	can_manage_roles?: boolean
	participants: ChatParticipant[]
}
