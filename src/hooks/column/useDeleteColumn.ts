import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { columnService } from '@/services/column.service'

export function useDeleteColumn() {
	const queryClient = useQueryClient()

	const { mutate: deleteColumn } = useMutation({
		mutationKey: ['delete column'],
		mutationFn: (id: string) => columnService.deleteColumn(id),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban']
			})
			toast.success('Колонка успешно удалена!')
		},
		onError(error: any) {
			toast.error(`Ошибка удаления: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { deleteColumn }
}
