import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { TypeTaskFormState } from '@/types/task.types'

import { taskService } from '@/services/task.service'

export function useCreateTask() {
	const queryClient = useQueryClient()

	const { mutate: createTask } = useMutation({
		mutationKey: ['create task'],
		mutationFn: (data: TypeTaskFormState) => taskService.createTask(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaceKanban']
			})
			toast.success('Задача успешно создана!')
		},
		onError(error: any) {
			toast.error(`Ошибка создания: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { createTask }
}
