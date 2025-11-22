import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { TypeColumnFormState } from '@/types/column.types'

import { columnService } from '@/services/column.service'

export function useUpdateColumn(key?: string) {
	const queryClient = useQueryClient()

	const { mutate: updateColumn } = useMutation({
		mutationKey: ['update column', key],
		mutationFn: ({ id, data }: { id: string; data: TypeColumnFormState }) =>
			columnService.updateColumn(id, data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spacesId']
			})
			toast.success('Колонка успешно изменена!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка изменения: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateColumn }
}
