export type AdminPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'range'

export interface IGroupsActivityStats {
	total: number
	active: number
	inactive: number
}

export interface IInactiveGroup {
	id: number
	name: string
	creator_id: number
	created_at: string
	creator: {
		id: number
		name: string
		email: string
	}
}
