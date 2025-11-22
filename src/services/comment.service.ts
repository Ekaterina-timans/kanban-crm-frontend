import { axiosRequest } from '@/api/interceptors'

class CommentService {
	private BASE_URL = '/tasks'

	/** Получить все комментарии по задаче */
	async getComments(taskId: string | number) {
		const response = await axiosRequest.get(
			`${this.BASE_URL}/${taskId}/comments`
		)
		return response.data
	}

	/** Создать комментарий */
	async createComment(
		taskId: string | number,
		payload:
			| {
					content: string
					files?: File[]
					reply_to_id?: number | string | null
					mentioned_user_ids?: Array<number | string>
			  }
			| FormData
	) {
		let body: any = payload
		if (!(payload instanceof FormData)) {
			if (payload.files && payload.files.length) {
				const fd = new FormData()
				fd.append('content', payload.content)
				if (payload.reply_to_id != null) {
					fd.append('reply_to_id', String(payload.reply_to_id))
				}
				if (payload.mentioned_user_ids && payload.mentioned_user_ids.length) {
					payload.mentioned_user_ids.forEach(id =>
						fd.append('mentioned_user_ids[]', String(id))
					)
				}
				payload.files.forEach(f => fd.append('files[]', f))
				body = fd
			}
		}
		const response = await axiosRequest.post(
			`${this.BASE_URL}/${taskId}/comments`,
			body
		)
		return response.data
	}

	/** Удалить комментарий */
	async deleteComment(commentId: string | number) {
		const response = await axiosRequest.delete(`/comments/${commentId}`)
		return response.data
	}
}

export const commentService = new CommentService()
