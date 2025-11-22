import { TRole } from '@/types/role.type'

import { axiosRequest } from '@/api/interceptors'

class SpaceUserService {
	private BASE_URL = '/spaces'

	/** Получить всех пользователей пространства с ролями и правами */
	async getSpaceUsers(spaceId: string) {
		const response = await axiosRequest.get(`${this.BASE_URL}/${spaceId}/users`)
		return response.data
	}

	/** Добавить пользователя в пространство */
	async addUserToSpace(spaceId: string, userId: string, role: TRole) {
		const response = await axiosRequest.post(
			`${this.BASE_URL}/${spaceId}/users`,
			{
				user_id: userId,
				role
			}
		)
		return response.data
	}

	/** Получить роль и права текущего пользователя в пространстве */
	async getMyRole(spaceId: string) {
		const response = await axiosRequest.get(`${this.BASE_URL}/${spaceId}/role`)
		return response.data
	}

	/** Получить данные и права конкретного пользователя пространства */
	async getUserRightsById(spaceUserId: string) {
		const response = await axiosRequest.get(`/space-users/${spaceUserId}`)
		return response.data
	}

	/** Обновить роль пользователя */
	async updateUserRole(spaceUserId: string, role: TRole) {
		const response = await axiosRequest.put(
			`/space-users/${spaceUserId}/role`,
			{ role }
		)
		return response.data
	}

	/** Обновить права пользователя */
	async updateUserPermissions(spaceUserId: string, permissions: number[]) {
		const response = await axiosRequest.put(
			`/space-users/${spaceUserId}/permissions`,
			{
				permissions
			}
		)
		return response.data
	}

	/** Удалить пользователя из пространства */
	async removeUserFromSpace(spaceUserId: string) {
		const response = await axiosRequest.delete(`/space-users/${spaceUserId}`)
		return response.data
	}
}

export const spaceUserService = new SpaceUserService()
