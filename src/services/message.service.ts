import { IAttachment, IMessage } from '@/types/message.types'

import { axiosRequest } from '@/api/interceptors'

class MessageService {
	private BASE_URL = '/chats'

	// курсорная выдача
	async list(
		chatId: string | number,
		params?: { limit?: number; before_id?: number; after_id?: number }
	) {
		const { data } = await axiosRequest.get<{
			messages: IMessage[]
			cursors: {
				oldest_id: number | null
				newest_id: number | null
				has_older: boolean
				has_newer: boolean
			}
		}>(`${this.BASE_URL}/${chatId}/messages`, { params })
		return data
	}

	async send(
		chatId: string | number,
		payload:
			| {
					content?: string
					kind?: 'text' | 'system' | 'poll'
					reply_to_id?: number
					meta?: any
					files?: File[]
					mentioned_user_ids?: Array<number | string>
			  }
			| FormData
	) {
		let body: any = payload
		if (!(payload instanceof FormData)) {
			if (payload.files && payload.files.length) {
				const fd = new FormData()
				if (payload.content) fd.append('content', payload.content)
				if (payload.kind) fd.append('kind', payload.kind)
				if (payload.reply_to_id)
					fd.append('reply_to_id', String(payload.reply_to_id))
				if (payload.mentioned_user_ids && payload.mentioned_user_ids.length) {
					payload.mentioned_user_ids.forEach(id =>
						fd.append('mentioned_user_ids[]', String(id))
					)
				}
				if (payload.meta) fd.append('meta', JSON.stringify(payload.meta))
				payload.files.forEach(f => fd.append('files[]', f))
				body = fd
			}
		}
		const { data } = await axiosRequest.post<IMessage>(
			`${this.BASE_URL}/${chatId}/messages`,
			body
		)
		return data
	}

	async markRead(chatId: string | number, lastId: number) {
		await axiosRequest.patch(`${this.BASE_URL}/${chatId}/read`, {
			last_read_message_id: lastId
		})
	}

	async delete(chatId: string | number, messageId: number | string) {
		await axiosRequest.delete(
			`${this.BASE_URL}/${chatId}/messages/${messageId}`
		)
	}
}

export const messageService = new MessageService()
