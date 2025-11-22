import { useMutation, useQueryClient } from '@tanstack/react-query'

import { checklistService } from '@/services/checklist.service'

export function useDeleteChecklistItem() {
	const queryClient = useQueryClient()

	const { mutate: deleteChecklistItem } = useMutation({
		mutationKey: ['delete checklist item'],
		mutationFn: (id: string) => checklistService.deleteChecklistItem(id),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['task'] })
			queryClient.invalidateQueries({ queryKey: ['checklists'] })
		}
	})

	return { deleteChecklistItem }
}
