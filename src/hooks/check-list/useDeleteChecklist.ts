import { checklistService } from "@/services/checklist.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteChecklist() {
	const queryClient = useQueryClient()

	const { mutate: deleteChecklist } = useMutation({
		mutationKey: ['delete checklist'],
		mutationFn: (id: string | number) => checklistService.deleteChecklist(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['checklists'] })
		}
	})

	return { deleteChecklist }
}