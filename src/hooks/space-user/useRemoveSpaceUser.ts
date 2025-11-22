import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { spaceUserService } from '@/services/space-user.service'

export function useRemoveSpaceUser(spaceId: string) {
	const queryClient = useQueryClient()

	const { mutate: removeSpaceUser, isPending } = useMutation({
		mutationKey: ['remove space user', spaceId],
		mutationFn: (spaceUserId: string) =>
			spaceUserService.removeUserFromSpace(spaceUserId),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['space-users', spaceId] })
			toast.success('Пользователь удалён из пространства!')
		},
		onError(error: any) {
			toast.error(`Ошибка удаления: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { removeSpaceUser, isPending }
}
