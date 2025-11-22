import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TypeChecklistItemFormState } from '@/types/checklist.types'

import { checklistService } from '@/services/checklist.service'

export function useCreateChecklistItem() {
	const queryClient = useQueryClient()

	const { mutate: createChecklistItem } = useMutation({
		mutationKey: ['create checklist item'],
		mutationFn: (data: {
			checklistId: string | number
			item: { name: string; assignee_id?: number; due_date?: string }
			taskId: string | number
		}) => checklistService.createChecklistItem(data.checklistId, data.item),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['task'] })
			queryClient.invalidateQueries({ queryKey: ['checklists'] })
		}
	})

	return { createChecklistItem }
}
