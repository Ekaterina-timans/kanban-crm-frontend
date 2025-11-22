import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import { TypeGroupFormState } from '@/types/group.types'

import { groupService } from '@/services/group.service'

export function useCreateGroup() {
	const queryClient = useQueryClient()
	const { checkAuth } = useAuth()

	const { mutate: createGroup, isPending } = useMutation({
		mutationKey: ['create group'],
		mutationFn: (data: TypeGroupFormState) => groupService.createGroup(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['groups']
			})
			checkAuth()
			toast.success('Группа успешно создана!')
		},
		onError(error: any) {
			toast.error(`Ошибка создания: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { createGroup, isPending }
}
