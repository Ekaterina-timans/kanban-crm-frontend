import { useMutation, useQueryClient } from '@tanstack/react-query'

import { checklistService } from '@/services/checklist.service'

export function useUpdateChecklist() {
	const queryClient = useQueryClient()

	const { mutate: updateChecklist } = useMutation({
		mutationKey: ['update checklist'],
		mutationFn: (data: {
			checklistId: string | number
			taskId: string | number
			title: string
		}) =>
			checklistService.updateChecklist(data.checklistId, { title: data.title }),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['checklists']
			})
			queryClient.invalidateQueries({
				queryKey: ['task']
			})
		}
	})

	return { updateChecklist }
}
