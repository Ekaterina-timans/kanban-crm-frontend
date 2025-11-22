import { INotification } from '@/types/notification.types'

import { axiosRequest } from '@/api/interceptors'

class NotificationService {
	private BASE_URL = '/notifications'

	async getNotifications() {
		const response = await axiosRequest.get<INotification[]>(
			`${this.BASE_URL}/unread`
		)
		return response.data
	}

	async markNotificationsRead() {
		const response = await axiosRequest.post<{ message: string }>(
			`${this.BASE_URL}/read`
		)
		return response.data
	}
}

export const notificationService = new NotificationService()
