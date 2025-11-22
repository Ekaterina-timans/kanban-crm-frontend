import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { spaceUserService } from '@/services/space-user.service'
import { TRole } from '@/types/role.type'

export function useAddSpaceUser(spaceId: string) {
	const queryClient = useQueryClient()

	const { mutate: addSpaceUser, isPending } = useMutation({
		mutationKey: ['add space user', spaceId],
		mutationFn: (data: {
			userId: string
			role: TRole
		}) => spaceUserService.addUserToSpace(spaceId, data.userId, data.role),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['space-users', spaceId] })
			toast.success('Пользователь добавлен в пространство!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка добавления: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { addSpaceUser, isPending }
}
