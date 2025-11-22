import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import { groupInvitationsService } from '@/services/group-invitations.service'

export function useAcceptGroupInvitation() {
	const queryClient = useQueryClient()
	const { checkAuth } = useAuth()

	const { mutate: acceptInvitation, isPending: isAccepting } = useMutation({
		mutationFn: (token: string) =>
			groupInvitationsService.acceptInvitation(token),
		onSuccess: () => {
			checkAuth()
			queryClient.invalidateQueries({ queryKey: ['user group invitations'] })
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Вы успешно присоединились к группе!')
		},
		onError: (err: any) =>
			toast.error(
				err?.response?.data?.message || 'Ошибка присоединения к группе'
			)
	})

	return { acceptInvitation, isAccepting }
}
