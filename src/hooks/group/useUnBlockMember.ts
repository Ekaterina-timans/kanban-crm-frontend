import { groupService } from "@/services/group.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useBlockMember(groupId: number | string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number | string) =>
			groupService.blockMember(groupId, userId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['group-members', groupId]
			})
		}
	})
}

export function useUnblockMember(groupId: number | string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number | string) =>
			groupService.unblockMember(groupId, userId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['group-members', groupId]
			})
		}
	})
}
