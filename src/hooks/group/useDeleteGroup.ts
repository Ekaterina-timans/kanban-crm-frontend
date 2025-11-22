import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import { groupService } from '@/services/group.service'

export function useDeleteGroup() {
	const { checkAuth } = useAuth()

	const { mutate: deleteGroup, isPending } = useMutation({
		mutationKey: ['delete group'],
		mutationFn: (groupId: string) => groupService.deleteGroup(groupId),
		onSuccess() {
			toast.success('Группа удалена')
			checkAuth() // обновляет группы + currentGroupId
		},
		onError(error: any) {
			toast.error(error?.response?.data?.message ?? 'Ошибка удаления')
		}
	})

	return { deleteGroup, isPending }
}
