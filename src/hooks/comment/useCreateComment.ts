import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '@/services/comment.service'

export function useCreateComment() {
	const queryClient = useQueryClient()

	const { mutate: createComment } = useMutation({
		mutationKey: ['create comment'],
		mutationFn: (data: {
			taskId: string | number
			content: string
			files?: File[]
			reply_to_id?: number | string | null
			mentioned_user_ids?: Array<number | string>
		}) =>
			commentService.createComment(data.taskId, {
				content: data.content,
				files: data.files,
				reply_to_id: data.reply_to_id ?? null,
				mentioned_user_ids: data.mentioned_user_ids ?? []
			}),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
			queryClient.invalidateQueries({
				queryKey: ['comments', variables.taskId]
			})
		}
	})

	return { createComment }
}
