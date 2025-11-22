import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { spaceUserService } from '@/services/space-user.service'

export function useUpdateUserPermissions(spaceId: string) {
	const queryClient = useQueryClient()

	const { mutate: updateUserPermissions, isPending } = useMutation({
		mutationKey: ['update user permissions', spaceId],
		mutationFn: (data: { spaceUserId: string; permissions: number[] }) =>
			spaceUserService.updateUserPermissions(
				data.spaceUserId,
				data.permissions
			),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['space-users', spaceId] })
			toast.success('Права пользователя обновлены!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка обновления прав: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateUserPermissions, isPending }
}
