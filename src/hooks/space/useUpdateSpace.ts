import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { TypeSpaceFormState } from '@/types/space.types'

import { spaceService } from '@/services/space.service'

export function useUpdateSpace(key?: string) {
	const queryClient = useQueryClient()

	const { mutate: updateSpace, isPending } = useMutation({
		mutationKey: ['update space', key],
		mutationFn: ({ id, data }: { id: string; data: TypeSpaceFormState }) =>
			spaceService.updateSpace(id, data),
		onSuccess: (_data, variables) => {
			// список пространств
			queryClient.invalidateQueries({ queryKey: ['spaces'] })

			// meta пространства (имя/описание/фон)
			queryClient.invalidateQueries({
				queryKey: ['spaceMeta', String(variables.id)]
			})

			// kanban (колонки/задачи)
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban', String(variables.id)]
			})

			toast.success('Пространство успешно изменено!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка изменения: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateSpace, isPending }
}
