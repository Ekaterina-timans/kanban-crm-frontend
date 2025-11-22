import { useAuth } from "@/providers/AuthProvider"
import { spaceService } from "@/services/space.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useDeleteSpace() {
	const queryClient = useQueryClient()
	const { currentGroupId } = useAuth()

	const { mutate: deleteSpace, isPending } = useMutation({
		mutationKey: ['delete space', currentGroupId],
		mutationFn: (spaceId: string) => spaceService.deleteSpace(spaceId),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['spaces', currentGroupId]
			})
			toast.success('Пространство удалено!')
		},
		onError(error: any) {
			toast.error(`Ошибка удаления: ${error?.message || 'Что-то пошло не так'}`)
		}
	})

	return { deleteSpace, isPending }
}