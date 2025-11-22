import { checklistService } from "@/services/checklist.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateChecklist() {
	const queryClient = useQueryClient()

	const { mutate: updateChecklist } = useMutation({
		mutationKey: ['update checklist'],
		mutationFn: (data: { checklistId: string | number; title: string }) =>
			checklistService.updateChecklist(data.checklistId, { title: data.title }),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['checklists', variables.checklistId] })
		}
	})

	return { updateChecklist }
}