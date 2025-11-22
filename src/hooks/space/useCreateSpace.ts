import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import { TypeSpaceFormState } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useCreateSpace() {
	const queryClient = useQueryClient()
	const { currentGroupId } = useAuth()

	const { mutate: createSpace } = useMutation({
		mutationKey: ['create space', currentGroupId],
		mutationFn: (data: TypeSpaceFormState) => {
			if (!currentGroupId) throw new Error('Нет выбранной группы')
			return spaceService.createSpace({ ...data, groupId: currentGroupId })
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaces', currentGroupId]
			})
			toast.success('Пространство успешно создано!')
		},
		onError(error: any) {
			toast.error(`Ошибка создания: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { createSpace }
}
