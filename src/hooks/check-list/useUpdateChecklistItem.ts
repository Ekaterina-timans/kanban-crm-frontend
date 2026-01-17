import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TypeChecklistItemFormState } from '@/types/checklist.types'

import { checklistService } from '@/services/checklist.service'

export function useUpdateChecklistItem() {
	const queryClient = useQueryClient()

	const { mutate: updateChecklistItem } = useMutation({
		mutationKey: ['update checklist item'],
		mutationFn: (data: {
			itemId: string | number
			taskId: string | number
			body: TypeChecklistItemFormState
		}) => {
			const formattedBody = {
				...data.body,
				assignee_id: data.body.assignee_id
					? Number(data.body.assignee_id)
					: undefined,
				due_date:
					data.body.due_date === undefined ? undefined : data.body.due_date
			}
			return checklistService.updateChecklistItem(data.itemId, formattedBody)
		},
		onSuccess(_, variables) {
			queryClient.invalidateQueries({
				queryKey: ['task']
			})
			queryClient.invalidateQueries({
				queryKey: ['checklists']
			})
		}
	})

	return { updateChecklistItem }
}
