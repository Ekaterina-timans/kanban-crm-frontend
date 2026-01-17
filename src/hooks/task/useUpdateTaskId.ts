import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { taskService } from '@/services/task.service'

export function useUpdateTaskId() {
	const queryClient = useQueryClient()

	const { mutate: updateTaskColumn, isPending } = useMutation({
		mutationKey: ['update task column'],
		mutationFn: ({ taskId, columnId }: { taskId: string; columnId: string }) =>
			taskService.updateTaskColumn(taskId, columnId),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban']
			})
			toast.success('Задача успешно изменена!')
		},
		onError(error: any) {
			toast.error(
				`Ошибка изменения: ${error?.message || 'Что-то пошло не так'}`
			)
		}
	})

	return { updateTaskColumn, isPending }
}
