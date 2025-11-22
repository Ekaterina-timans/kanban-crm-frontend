import { IUserActual } from '@/types/user.types'

import { axiosRequest } from '@/api/interceptors'

class UserPreferencesService {
	private BASE = '/user/actual'

	async getActual() {
		const res = await axiosRequest.get<IUserActual>(this.BASE)
		return res.data
	}

	async setGroup(groupId: string) {
		await axiosRequest.post(`${this.BASE}/group`, { group_id: groupId })
	}

	async setSpace(spaceId: string) {
		await axiosRequest.post(`${this.BASE}/space`, { space_id: spaceId })
	}

	async setTimezone(timezone: string) {
		await axiosRequest.post(`${this.BASE}/timezone`, { timezone })
	}
}

export const userPreferencesService = new UserPreferencesService()
