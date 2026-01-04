import {
	IGroupDetails,
	IGroupMember,
	IGroupSpace
} from '@/types/admin-group.types'

import { axiosRequest } from '@/api/interceptors'

class AdminGroupService {
	private BASE = '/admin/groups'

	/** Список групп */
	async getGroups(params?: {
		q?: string
		status?: 'active' | 'passive'
		sort?: 'activity'
		page?: number
	}) {
		const res = await axiosRequest.get(this.BASE, { params })
		return res.data
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
