import { PeriodParams } from '@/components/ui/period-select/period'

import { ChecklistStats, HourActivity, TaskPriorities, TasksStats, TaskStatuses, UserStatistics } from '@/types/statistics.types'

import { axiosRequest } from '@/api/interceptors'

class StatisticsPersonalService {
	private BASE_URL = '/statistics'

	async getStatistics(groupId: string, userId: number, period: PeriodParams) { 
		return axiosRequest.get<UserStatistics>(`${this.BASE_URL}/personal`, { 
			params: { 
				group_id: groupId, 
				user_id: userId, 
				period: period.period, 
				date_from: period.date_from, 
				date_to: period.date_to 
			} 
		}) 
	}

  async getTasks(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<TasksStats>(`${this.BASE_URL}/tasks`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getTaskStatuses(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<TaskStatuses>(`${this.BASE_URL}/statuses`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getTaskPriorities(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<TaskPriorities>(`${this.BASE_URL}/priorities`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getChecklist(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<ChecklistStats>(`${this.BASE_URL}/checklist`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getHourActivity(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<HourActivity>(`${this.BASE_URL}/hour-activity`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getProductivity(groupId: string, userId: number, p: PeriodParams) {
    return axiosRequest.get<number>(`${this.BASE_URL}/productivity`, {
      params: {
        group_id: groupId,
        user_id: userId,
        period: p.period,
        date_from: p.date_from,
        date_to: p.date_to
      }
    })
  }

  async getProgress(groupId: string, userId: number) {
    return axiosRequest.get<UserStatistics>(`${this.BASE_URL}/personal`, {
      params: {
        group_id: groupId,
        user_id: userId
      }
    })
  }
}

export const statisticsPersonalService = new StatisticsPersonalService()