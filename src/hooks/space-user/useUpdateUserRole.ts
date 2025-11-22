import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { TRole } from '@/types/role.type'

import { spaceUserService } from '@/services/space-user.service'

export function useUpdateUserRole(spaceId: string) {
	const queryClient = useQueryClient()

	const { mutate: updateUserRole, isPending } = useMutation({
		mutationKey: ['update user role', spaceId],
		mutationFn: (data: { spaceUserId: string; role: TRole }) =>
			spaceUserService.updateUserRole(data.spaceUserId, data.role),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['space-users', spaceId] })
			toast.success('Роль пользователя обновлена!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка обновления роли: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateUserRole, isPending }
}
