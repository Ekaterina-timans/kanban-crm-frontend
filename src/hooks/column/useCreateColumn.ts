import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { TypeColumnFormState } from '@/types/column.types'

import { columnService } from '@/services/column.service'

export function useCreateColumn() {
	const queryClient = useQueryClient()

	const { mutate: createColumn } = useMutation({
		mutationKey: ['create column'],
		mutationFn: (data: TypeColumnFormState) => columnService.createColumn(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban']
			})
			toast.success('Колонка успешно создана!')
		},
		onError(error: any) {
			toast.error(`Ошибка создания: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { createColumn }
}
