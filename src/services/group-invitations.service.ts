import {
	IGroupInvitation,
	InviteToGroupDto,
	InviteToGroupResponse
} from '@/types/group-invititations.types'

import { axiosRequest } from '@/api/interceptors'

class GroupInvitationsService {
	private BASE_URL = '/groups'

	async getGroupInvitations(groupId: string) {
		const response = await axiosRequest.get<IGroupInvitation[]>(
			`${this.BASE_URL}/${groupId}/group-invitations`
		)
		return response
	}

	async inviteToGroup(data: InviteToGroupDto) {
		const response = await axiosRequest.post(
			`${this.BASE_URL}/group-invitations/invite`,
			data
		)
		return response.data
	}

	async getUserInvitations() {
		const response = await axiosRequest.get<IGroupInvitation[]>(
			`${this.BASE_URL}/group-invitations/user`
		)
		return response.data
	}

	async acceptInvitation(token: string): Promise<{ message: string }> {
		const response = await axiosRequest.post(
			`${this.BASE_URL}/group-invitations/accept`,
			{ token }
		)
		return response.data
	}

	async declineInvitation(token: string): Promise<{ message: string }> {
		const response = await axiosRequest.post(
			`${this.BASE_URL}/group-invitations/decline`,
			{ token }
		)
		return response.data
	}
}

export const groupInvitationsService = new GroupInvitationsService()
