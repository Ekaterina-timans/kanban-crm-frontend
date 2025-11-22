import { taskService } from "@/services/task.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export function useUpdateTaskId() {
	const queryClient = useQueryClient()

	const { mutate: updateTaskColumn, isPending } = useMutation({
		mutationKey: ['update task column'],
		mutationFn: ({ taskId, columnId }: { taskId: string; columnId: string }) =>
			taskService.updateTaskColumn(taskId, columnId),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spacesId']
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
