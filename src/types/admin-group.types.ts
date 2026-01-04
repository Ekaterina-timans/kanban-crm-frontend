export interface IAdminGroup {
	id: number
	name: string
	users_count: number
	spaces_count: number
	activity_score: number | null
}

export interface IGroupMember {
	id: number
	name: string
	email: string
	role: string
	status: string
}

export interface IGroupSpace {
	id: number
	name: string
}

export interface IGroupDetails {
	id: number
	name: string
	computed_status: 'active' | 'passive'
	created_at: string
	members_count: number
	spaces_count: number
	creator: {
		id: number
		name: string
		email: string
		avatar?: string
	}
}
