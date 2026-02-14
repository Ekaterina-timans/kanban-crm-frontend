import {
	TgMessagesResponse,
	TgThreadsResponse
} from '@/types/telegram-chat.types'

import { axiosRequest } from '@/api/interceptors'

class TelegramChatService {
	private BASE_GROUPS = '/groups'
	private BASE_THREADS = '/threads'

	async listThreads(params: {
		groupId: string | number
		channelId: string | number
		q?: string
		per_page?: number
	}) {
		const { groupId, channelId, q, per_page } = params
		const { data } = await axiosRequest.get<TgThreadsResponse>(
			`${this.BASE_GROUPS}/${groupId}/channels/${channelId}/threads`,
			{ params: { q, per_page } }
		)
		return data
	}

	async listMessages(params: {
		threadId: string | number
		per_page?: number
		direction?: 'in' | 'out'
		page?: number
	}) {
		const { threadId, ...rest } = params
		const { data } = await axiosRequest.get<TgMessagesResponse>(
			`${this.BASE_THREADS}/${threadId}/messages`,
			{ params: rest }
		)
		return data
	}

	async sendMessage(params: { threadId: string | number; text: string }) {
		const { threadId, text } = params
		const { data } = await axiosRequest.post<{ ok: true; message: any }>(
			`${this.BASE_THREADS}/${threadId}/messages/send`,
			{ text }
		)
		return data
	}

	telegramFileUrl(
		threadId: string | number,
		fileId: string,
		opts?: { download?: boolean }
	) {
		const u = new URLSearchParams()
		u.set('file_id', fileId)
		if (opts?.download) u.set('download', '1')
		return `${this.BASE_THREADS}/${threadId}/telegram-file?${u.toString()}`
	}

	async sendMessageWithFile(params: {
		threadId: string | number
		text?: string
		file?: File | null
	}) {
		const { threadId, text, file } = params

		const fd = new FormData()
		if (text && text.trim()) fd.append('text', text.trim())
		if (file) fd.append('file', file)

		const { data } = await axiosRequest.post<{ ok: true; message: any }>(
			`${this.BASE_THREADS}/${threadId}/messages/send`,
			fd,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		)
		return data
	}

	async searchChannel(params: {
		groupId: string | number
		channelId: string | number
		q: string
		limit_threads?: number
		limit_messages?: number
	}) {
		const {
			groupId,
			channelId,
			q,
			limit_threads = 10,
			limit_messages = 30
		} = params

		const { data } = await axiosRequest.get<{
			threads: any[]
			messages: any[]
		}>(`${this.BASE_GROUPS}/${groupId}/channels/${channelId}/search`, {
			params: { q: q.trim(), limit_threads, limit_messages }
		})

		return data
	}

	async searchMessages(params: {
		threadId: string | number
		q: string
		limit?: number
	}) {
		const { threadId, q, limit = 50 } = params
		const { data } = await axiosRequest.get<{
			q: string
			limit: number
			count: number
			data: any[]
		}>(`${this.BASE_THREADS}/${threadId}/messages/search`, {
			params: { q: q.trim(), limit }
		})
		return data
	}
}

export const telegramChatService = new TelegramChatService()
