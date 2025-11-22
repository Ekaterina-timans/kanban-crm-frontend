import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import {
	InviteToGroupDto,
	InviteToGroupResponse
} from '@/types/group-invititations.types'

import { groupInvitationsService } from '@/services/group-invitations.service'

export function useInviteToGroup() {
	const queryClient = useQueryClient()

	const { mutate: inviteToGroup, isPending } = useMutation<
		InviteToGroupResponse, // что возвращает (response)
		Error, // тип ошибки (можно any, если не хочешь кастомный Error)
		InviteToGroupDto // что передаём (input)
	>({
		mutationKey: ['invite to group'],
		mutationFn: (dto: InviteToGroupDto) =>
			groupInvitationsService.inviteToGroup(dto),
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
