import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { taskService } from '@/services/task.service'

export function useDeleteTask() {
	const queryClient = useQueryClient()

	const { mutate: deleteTask, isPending } = useMutation({
		mutationKey: ['delete task'],
		mutationFn: (taskId: string | number) => taskService.deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['spacesId'] })
			toast.success('Задача удалена!')
		},
		onError: (error: any) => {
			toast.error(`Ошибка удаления: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { deleteTask, isPending }
}
