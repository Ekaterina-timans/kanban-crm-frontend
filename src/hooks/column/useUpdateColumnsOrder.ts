import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { IColumnPosition } from '@/types/column.types'

import { columnService } from '@/services/column.service'

export function useUpdateColumnsOrder() {
	const queryClient = useQueryClient()

	const { mutate: updateColumnsOrder, isPending } = useMutation({
		mutationKey: ['update columns order'],
		mutationFn: (columns: IColumnPosition[]) =>
			columnService.updateColumnsOrder(columns),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban']
			})
			toast.success('Порядок колонок сохранён!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка сохранения порядка: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateColumnsOrder, isPending }
}
