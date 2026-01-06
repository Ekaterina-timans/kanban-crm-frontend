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
	avatar?: string | null
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

export type AdminGroupsParams = {
	q?: string
	status?: 'active' | 'passive'
	sort?: 'activity'
	page?: number
	per_page?: number
}

export type LaravelLink = {
	url: string | null
	label: string
	active: boolean
}

export type LaravelPagination<T> = {
	current_page: number
	data: T[]
	first_page_url: string
	from: number | null
	last_page: number
	last_page_url: string
	links: LaravelLink[]
	next_page_url: string | null
	path: string
	per_page: number
	prev_page_url: string | null
	to: number | null
	total: number
}

export type PaginationMeta = {
	current_page: number
	last_page: number
	per_page: number
	total: number
	from: number | null
	to: number | null
}

export type PaginatedResponse<T> = {
	data: T[]
	meta: PaginationMeta
	links: LaravelLink[]
}