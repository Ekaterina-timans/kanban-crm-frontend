import {
	AdminUsersParams,
	IAdminUser,
	IUserGroupInfo,
	LaravelPagination,
	PaginatedResponse
} from '@/types/admin-user.types'

import { axiosRequest } from '@/api/interceptors'

class AdminUserService {
	private BASE = '/admin/users'

	/* Список пользователей */
	async getUsers(
		params?: AdminUsersParams
	): Promise<PaginatedResponse<IAdminUser>> {
		const res = await axiosRequest.get<LaravelPagination<IAdminUser>>(
			this.BASE,
			{
				params
			}
		)

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

	/* Один пользователь */
	async getUser(id: number): Promise<{
		user: IAdminUser
		groups: IUserGroupInfo[]
	}> {
		const res = await axiosRequest.get(`${this.BASE}/${id}`)
		return res.data
	}

	/* Заблокировать */
	async blockUser(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.patch(`${this.BASE}/${id}/block`)
		return res.data
	}

	/* Разблокировать */
	async unblockUser(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.patch(`${this.BASE}/${id}/unblock`)
		return res.data
	}

	/* Удалить пользователя */
	async deleteUser(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.delete(`${this.BASE}/${id}`)
		return res.data
	}

	/* Назначить админом приложения */
	async promoteUser(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.patch(`${this.BASE}/${id}/promote`)
		return res.data
	}

	/* Снять админа приложения */
	async demoteUser(id: number): Promise<{ message: string }> {
		const res = await axiosRequest.patch(`${this.BASE}/${id}/demote`)
		return res.data
	}

	/* Блокировка пользователя в конкретной группе */
	async blockUserInGroup(
		userId: number,
		groupId: number
	): Promise<{ message: string }> {
		const res = await axiosRequest.patch(
			`${this.BASE}/${userId}/groups/${groupId}/block`
		)
		return res.data
	}

	/* Разблокировка пользователя в конкретной группе */
	async unblockUserInGroup(
		userId: number,
		groupId: number
	): Promise<{ message: string }> {
		const res = await axiosRequest.patch(
			`${this.BASE}/${userId}/groups/${groupId}/unblock`
		)
		return res.data
	}
}

export const adminUserService = new AdminUserService()
