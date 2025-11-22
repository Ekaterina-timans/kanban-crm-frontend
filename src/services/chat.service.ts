import { ChatRole, IChat, ParticipantsResponse } from '@/types/chat.type'
import { IAttachment, IMessage } from '@/types/message.types'

import { axiosRequest } from '@/api/interceptors'

export type GlobalSearchResponse = {
	chats: Array<
		Pick<
			IChat,
			| 'id'
			| 'title'
			| 'type'
			| 'avatar'
			| 'last_message_id'
			| 'last_message'
			| 'last_message_at'
		>
	>
	messages: Array<
		Pick<IMessage, 'id' | 'chat_id' | 'user_id' | 'content' | 'created_at'> & {
			user?: any
		}
	>
}

class ChatService {
	private BASE_URL = '/chats'

	async getGroupChats(groupId: string | number) {
		const { data } = await axiosRequest.get<IChat[]>(`/groups/${groupId}/chats`)
		return data
	}

	async createChat(
		groupId: string | number,
		payload: {
			type: 'group' | 'direct'
			title?: string
			participants: Array<string | number>
		}
	) {
		const { data } = await axiosRequest.post(
			`/groups/${groupId}/chats`,
			payload
		)
		return data
	}

	// инфо по чату (для шапки)
	async getChat(chatId: string | number) {
		const { data } = await axiosRequest.get(`${this.BASE_URL}/${chatId}`)
		return data
	}

	async updateAvatar(chatId: string | number, file: File) {
		const fd = new FormData()
		fd.append('avatar', file)
		const { data } = await axiosRequest.post(
			`${this.BASE_URL}/${chatId}/avatar`,
			fd,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		)
		return data
	}

	async deleteChat(chatId: string | number) {
		const { data } = await axiosRequest.delete(`${this.BASE_URL}/${chatId}`)
		return data as { ok: true }
	}

	async leaveChat(chatId: string | number) {
		const { data } = await axiosRequest.post(`${this.BASE_URL}/${chatId}/leave`)
		return data as { ok: true }
	}

	async clearHistory(chatId: string | number) {
		const { data } = await axiosRequest.delete(
			`${this.BASE_URL}/${chatId}/messages`
		)
		return data as { ok: true }
	}

	async listParticipants(chatId: string | number) {
		const { data } = await axiosRequest.get<ParticipantsResponse>(
			`${this.BASE_URL}/${chatId}/participants`
		)
		return data
	}

	async addParticipants(
		chatId: string | number,
		payload: {
			emails?: string[]
			user_ids?: Array<number | string>
			role?: 'member' | 'admin' | 'owner'
		}
	) {
		const { data } = await axiosRequest.post(
			`/chats/${chatId}/participants`,
			payload
		)
		return data as {
			ok: true
			participants?: Array<{
				id: number
				name?: string | null
				email: string
				avatar?: string | null
				role: 'owner' | 'admin' | 'member'
			}>
		}
	}

	async updateParticipantRole(
		chatId: string | number,
		p: { user_id: string | number; role: 'owner' | 'admin' | 'member' }
	) {
		return axiosRequest.patch(
			`${this.BASE_URL}/${chatId}/participants/${p.user_id}`,
			{ role: p.role }
		)
	}

	async removeParticipant(
		chatId: string | number,
		p: { user_id: string | number }
	) {
		return axiosRequest.delete(
			`${this.BASE_URL}/${chatId}/participants/${p.user_id}`
		)
	}

	// все вложения чата (бэк возвращает url и download_url)
	async listAttachments(chatId: string | number) {
		const { data } = await axiosRequest.get<IAttachment[]>(
			`${this.BASE_URL}/${chatId}/attachments`
		)
		return data
	}

	async globalSearch(q: string) {
		const { data } = await axiosRequest.get<GlobalSearchResponse>(`/search`, {
			params: { q }
		})
		return data
	}

	async searchInChat(
		chatId: string | number,
		q: string,
		params?: { limit?: number; before_id?: number; after_id?: number }
	) {
		const { data } = await axiosRequest.get<{
			query: string
			messages: IMessage[]
			cursors: {
				oldest_id: number | null
				newest_id: number | null
				has_older: boolean
				has_newer: boolean
			}
		}>(`${this.BASE_URL}/${chatId}/search`, { params: { q, ...params } })
		return data
	}
}

export const chatService = new ChatService()
