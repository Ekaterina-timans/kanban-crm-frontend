export interface IAdminUser {
	id: number
	email: string
	name?: string | null
	avatar?: string | null
	account_status: 'active' | 'blocked'
	created_at: string
	access_level?: 'admin' | 'user'
}

export interface IUserGroupInfo {
	group_id: number
	group_name: string
	role: string
	status: string
}

export type AdminUsersParams = {
	q?: string
	status?: string
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