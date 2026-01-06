import {
	AdminGroupsParams,
	IAdminGroup,
	IGroupDetails,
	IGroupMember,
	IGroupSpace,
	LaravelPagination,
	PaginatedResponse
} from '@/types/admin-group.types'

import { axiosRequest } from '@/api/interceptors'

class AdminGroupService {
	private BASE = '/admin/groups'

	/** Список групп */
	async getGroups(params?: AdminGroupsParams): Promise<PaginatedResponse<IAdminGroup>> {
		const res = await axiosRequest.get<LaravelPagination<IAdminGroup>>(this.BASE, {
			params
		})

		const p = res.data

		return {
			data: p.data,
			meta: {
				current_page: p.current_page,
				last_page: p.last_page,
				per_page: p.per_page,
				total: p.total,
				from: p.from,
				to: p.to
			},
			links: p.links
		}
	}

	/** Детали группы */
	async getGroup(id: number): Promise<{
		group: IGroupDetails
		members: IGroupMember[]
		spaces: IGroupSpace[]
		activity_last_14_days: number
	}> {
		const res = await axiosRequest.get(`${this.BASE}/${id}`)
		return res.data
	}

	/** Удалить группу */
	async deleteGroup(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.delete(`${this.BASE}/${id}`)
		return res.data
	}
}

export const adminGroupService = new AdminGroupService()
