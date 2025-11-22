import { useMutation, useQueryClient } from '@tanstack/react-query'

import { taskService } from '@/services/task.service'

interface UpdateNameArgs {
	taskId: string
	name: string
}

interface UpdateDescriptionArgs {
	taskId: string
	description: string | null
}

interface UpdateStatusArgs {
	taskId: string
	statusId: number
}

interface UpdatePriorityArgs {
	taskId: string
	priorityId: number
}

interface UpdateDueDateArgs {
	taskId: string
	dueDate: string | null
}

interface UpdateAssigneeArgs {
	taskId: string
	assigneeId: number | null
}

export function useUpdateTask() {
	const queryClient = useQueryClient()

	const invalidate = (taskId: string) => {
		queryClient.invalidateQueries({ queryKey: ['task', String(taskId)] })
		queryClient.invalidateQueries({ queryKey: ['spacesId'] })
	}

	/** Обновить наименование */
	const { mutate: updateName, isPending: isNameUpdating } = useMutation({
		mutationFn: ({ taskId, name }: UpdateNameArgs) =>
			taskService.renameTask(taskId, name),
		onSuccess: (_data, variables) => invalidate(variables.taskId)
	})

	/** Обновить описание */
	const { mutate: updateDescription, isPending: isDescriptionUpdating } =
		useMutation({
			mutationFn: ({ taskId, description }: UpdateDescriptionArgs) =>
				taskService.updateDescription(taskId, description),
			onSuccess: (_data, variables) => invalidate(variables.taskId)
		})

	/** Обновить статус */
	const { mutate: updateStatus, isPending: isStatusUpdating } = useMutation({
		mutationFn: ({ taskId, statusId }: UpdateStatusArgs) =>
			taskService.updateStatus(taskId, statusId),
		onSuccess: (_data, variables) => invalidate(variables.taskId)
	})

	/** Обновить приоритет */
	const { mutate: updatePriority, isPending: isPriorityUpdating } = useMutation(
		{
			mutationFn: ({ taskId, priorityId }: UpdatePriorityArgs) =>
				taskService.updatePriority(taskId, priorityId),
			onSuccess: (_data, variables) => invalidate(variables.taskId)
		}
	)

	/** Обновить срок выполнения */
	const { mutate: updateDueDate, isPending: isDueDateUpdating } = useMutation({
		mutationFn: ({ taskId, dueDate }: UpdateDueDateArgs) =>
			taskService.updateDueDate(taskId, dueDate),
		onSuccess: (_data, variables) => invalidate(variables.taskId)
	})

	/** Обновить ответственного */
	const { mutate: updateAssignee, isPending: isAssigneeUpdating } = useMutation(
		{
			mutationFn: ({ taskId, assigneeId }: UpdateAssigneeArgs) =>
				taskService.updateAssignee(taskId, assigneeId),
			onSuccess: (_data, variables) => invalidate(variables.taskId),
		}
	)

	return {
		updateName,
		updateDescription,
		updateStatus,
		updatePriority,
		updateDueDate,
		updateAssignee,
		isNameUpdating,
		isDescriptionUpdating,
		isStatusUpdating,
		isPriorityUpdating,
		isDueDateUpdating,
		isAssigneeUpdating
	}
}
