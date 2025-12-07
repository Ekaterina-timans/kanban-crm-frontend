import { PeriodParams } from '@/components/ui/period-select/period'

import {
	GroupOverdueStats,
	GroupSpaceStats,
	GroupTasksDynamicsBySpace,
	GroupTeamHours,
	GroupTopUser,
	GroupWorkloadItem
} from '@/types/statistics.types'

import { axiosRequest } from '@/api/interceptors'

class StatisticsGeneralService {
	private BASE_URL = '/statistics/group'

	// 1. ТОП-участников по активности
	async getGroupTopUsers(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupTopUser[]>(`${this.BASE_URL}/top-users`, {
			params: {
				group_id: groupId,
				period: p.period,
				date_from: p.date_from,
				date_to: p.date_to
			}
		})
	}

	// 2. Динамика задач по space'ам
	async getGroupTasksDynamics(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupTasksDynamicsBySpace[]>(
			`${this.BASE_URL}/tasks-dynamics`,
			{
				params: {
					group_id: groupId,
					period: p.period,
					date_from: p.date_from,
					date_to: p.date_to
				}
			}
		)
	}

	// 3. Загруженность участников
	async getGroupWorkload(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupWorkloadItem[]>(`${this.BASE_URL}/workload`, {
			params: {
				group_id: groupId,
				period: p.period,
				date_from: p.date_from,
				date_to: p.date_to
			}
		})
	}

	// 4. Самые активные проекты (пространства)
	async getGroupSpacesStats(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupSpaceStats[]>(`${this.BASE_URL}/spaces`, {
			params: {
				group_id: groupId,
				period: p.period,
				date_from: p.date_from,
				date_to: p.date_to
			}
		})
	}

	// 5. Просроченные задачи
	async getGroupOverdue(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupOverdueStats>(`${this.BASE_URL}/overdue`, {
			params: {
				group_id: groupId,
				period: p.period,
				date_from: p.date_from,
				date_to: p.date_to
			}
		})
	}

	// 6. Рабочие часы команды (heatmap)
	async getGroupTeamHours(groupId: string, p: PeriodParams) {
		return axiosRequest.get<GroupTeamHours>(`${this.BASE_URL}/team-hours`, {
			params: {
				group_id: groupId,
				period: p.period,
				date_from: p.date_from,
				date_to: p.date_to
			}
		})
	}
}

export const statisticsGeneralService = new StatisticsGeneralService()
