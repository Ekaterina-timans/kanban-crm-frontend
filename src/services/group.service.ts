import { IGroup, IGroupMember } from '@/types/group.types'

import { axiosRequest } from '@/api/interceptors'

class GroupService {
	private BASE_URL = '/groups'

	async getGroups() {
		const response = await axiosRequest.get<IGroup[]>(this.BASE_URL)
		return response
	}

	async createGroup(data: { name: string; description?: string }) {
		const response = await axiosRequest.post<IGroup>(this.BASE_URL, data)
		return response
	}

	async getGroupById(groupId: string | number) {
		const response = await axiosRequest.get<IGroup>(
			`${this.BASE_URL}/${groupId}`
		)
		return response.data
	}

	async updateGroup(groupId: string | number, data: any) {
		return axiosRequest.patch(`${this.BASE_URL}/${groupId}`, data)
	}

	async deleteGroup(groupId: string | number) {
		return axiosRequest.delete(`${this.BASE_URL}/${groupId}`)
	}

	async joinGroup(groupId: string) {
		const response = await axiosRequest.post<IGroup>(
			`${this.BASE_URL}/${groupId}/join`
		)
		return response
	}

	async leaveGroup(groupId: string) {
		const response = await axiosRequest.post<{ message: string }>(
			`${this.BASE_URL}/${groupId}/leave`
		)
		return response
	}

	async getGroupMembers(groupId: string | number, q?: string) {
		const params = q ? { q } : undefined
		const response = await axiosRequest.get<IGroupMember[]>(
			`${this.BASE_URL}/${groupId}/members`,
			{ params }
		)
		return response.data
	}

	async blockMember(groupId: string | number, userId: string | number) {
		return axiosRequest.patch(
			`${this.BASE_URL}/${groupId}/members/${userId}/block`
		)
	}

	async unblockMember(groupId: string | number, userId: string | number) {
		return axiosRequest.patch(
			`${this.BASE_URL}/${groupId}/members/${userId}/unblock`
		)
	}

	async removeMember(groupId: string | number, userId: string | number) {
		return axiosRequest.delete(`${this.BASE_URL}/${groupId}/members/${userId}`)
	}
}

export const groupService = new GroupService()
