import { commentService } from "@/services/comment.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteComment() {
	const queryClient = useQueryClient()

	const { mutate: deleteComment } = useMutation({
		mutationKey: ['delete comment'],
		mutationFn: (id: string) => commentService.deleteComment(id),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['task'] })
			queryClient.invalidateQueries({ queryKey: ['comments'] })
		}
	})

	return { deleteComment }
}