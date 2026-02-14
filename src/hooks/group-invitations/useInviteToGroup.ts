import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import {
	InviteToGroupDto,
	InviteToGroupResponse
} from '@/types/group-invititations.types'

import { groupInvitationsService } from '@/services/group-invitations.service'

export function useInviteToGroup() {
	const queryClient = useQueryClient()
	const { currentGroupId } = useAuth()

	const { mutate: inviteToGroup, isPending } = useMutation<
		InviteToGroupResponse,
		any,
		InviteToGroupDto
	>({
		mutationKey: ['invite to group'],
		mutationFn: dto =>
			groupInvitationsService.inviteToGroup(String(currentGroupId), dto),
		onSuccess: (_res, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['group invitations', variables.group_id]
			})
			toast.success('Приглашение успешно отправлено!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка приглашения: ${error?.response?.data?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { inviteToGroup, isPending }
}
