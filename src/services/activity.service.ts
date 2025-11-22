import { axiosRequest } from '@/api/interceptors'

export const activityService = {
	async getLogs(params: {
		group_id: string
		entity_type?: string
		user_id?: string
		action?: string
		date?: string
	}) {
		return axiosRequest.get('/activity-logs', { params })
	}
}
