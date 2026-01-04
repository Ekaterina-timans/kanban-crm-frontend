import {
	AdminPeriod,
	IGroupsActivityStats,
	IInactiveGroup
} from '@/types/admin-statistics.types'

import { axiosRequest } from '@/api/interceptors'

class AdminStatisticsService {
	private BASE = '/admin/statistics'

	/** Всего пользователей */
	async usersTotal(): Promise<{ total: number }> {
		const res = await axiosRequest.get(`${this.BASE}/users-total`)
		return res.data
	}

	/** Заблокированные пользователи */
	async usersBlocked(): Promise<{ blocked: number }> {
		const res = await axiosRequest.get(`${this.BASE}/users-blocked`)
		return res.data
	}

	/** Всего групп */
	async groupsTotal(): Promise<{ total: number }> {
		const res = await axiosRequest.get(`${this.BASE}/groups-total`)
		return res.data
	}

	/** Активные / пассивные группы */
	async groupsActivity(params?: {
		period?: AdminPeriod
		date_from?: string
		date_to?: string
	}): Promise<IGroupsActivityStats> {
		const res = await axiosRequest.get(`${this.BASE}/groups-activity`, {
			params
		})

		return res.data
	}

	/** Пассивные группы */
	async inactiveGroups(params?: {
		period?: AdminPeriod
		date_from?: string
		date_to?: string
	}): Promise<{ groups: IInactiveGroup[] }> {
		const res = await axiosRequest.get(`${this.BASE}/groups-inactive`, {
			params
		})

		return res.data
	}
}

export const adminStatisticsService = new AdminStatisticsService()
