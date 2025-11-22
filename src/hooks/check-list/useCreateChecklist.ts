import { useMutation, useQueryClient } from '@tanstack/react-query'

import { checklistService } from '@/services/checklist.service'

export function useCreateChecklist() {
	const queryClient = useQueryClient()

	const { mutate: createChecklist } = useMutation({
		mutationKey: ['create checklist'],
		mutationFn: (data: { taskId: string | number; title: string }) =>
			checklistService.createChecklist(data.taskId, data.title),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
			queryClient.invalidateQueries({
				queryKey: ['checklists', variables.taskId]
			})
		}
	})

	return { createChecklist }
}
