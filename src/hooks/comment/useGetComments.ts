import { useQuery } from '@tanstack/react-query'

import { commentService } from '@/services/comment.service'

export function useGetComments(taskId: string) {
	const {
		data: comments,
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ['comments', taskId],
		queryFn: async () => {
			const response = await commentService.getComments(taskId)
			return response
		},
		enabled: !!taskId,
		retry: false
	})

	return { comments, isLoading, error, refetch }
}
