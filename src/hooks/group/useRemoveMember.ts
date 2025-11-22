import { groupService } from "@/services/group.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useRemoveMember(groupId: number | string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number | string) =>
			groupService.removeMember(groupId, userId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['group-members', groupId]
			})
		}
	})
}
