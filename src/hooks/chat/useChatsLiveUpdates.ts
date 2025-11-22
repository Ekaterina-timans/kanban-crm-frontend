'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import type { IChat } from '@/types/chat.type'

import { getEcho } from '@/lib/echoClient'

type WsMsg = {
	chat_id: number | string
	message_id: number
	preview: string
	user_id: number | string
	created_at?: string
}

type Params = {
	groupId: string | number | null
	chats: IChat[]
	selectedChatId?: string | number | null
}

export function useChatsLiveUpdates({
	groupId,
	chats,
	selectedChatId
}: Params) {
	const qc = useQueryClient()
	const { user } = useAuth()
	const currentUserId = user?.id

	useEffect(() => {
		if (!groupId || !chats?.length) return

		let echo: ReturnType<typeof getEcho> | null = null
		try {
			echo = getEcho()
		} catch {
			return
		}

		const cacheKey: [string, string] = ['chats', String(groupId)]

		for (const chat of chats) {
			const channel = echo.private(`chat.${chat.id}`)

			try {
				channel.stopListening('.message.created')
			} catch {}

			channel.listen('.message.created', (payload: WsMsg) => {
				const { chat_id, message_id, preview, user_id, created_at } =
					payload || ({} as WsMsg)
				if (!chat_id) return

				qc.setQueryData<IChat[]>(cacheKey, prev => {
					if (!prev) return prev

					const arr = [...prev]
					const idx = arr.findIndex(c => String(c.id) === String(chat_id))
					if (idx === -1) return prev

					const isSelected = String(selectedChatId ?? '') === String(chat_id)
					const isSender =
						currentUserId != null && String(user_id) === String(currentUserId)

					const text = (preview ?? '').trim()
					const nextUnread =
						isSelected || isSender ? 0 : (arr[idx].unread_count ?? 0) + 1

					const updated: IChat = {
						...arr[idx],
						last_message_id: message_id,
						last_message: text.length ? text : 'Вложение',
						unread_count: nextUnread,
						updated_at: created_at ?? new Date().toISOString()
					}

					arr.splice(idx, 1)
					return [updated, ...arr]
				})
			})
		}

		return () => {
			if (!echo) return
			const actual = new Set(chats.map(c => `chat.${c.id}`))

			const pusher: any = (echo as any)?.connector?.pusher
			const known = pusher?.channels?.channels
				? Object.keys(pusher.channels.channels)
				: []

			const toLeave = known
				.map((n: string) => n.replace(/^private-/, ''))
				.filter((n: string) => n.startsWith('chat.'))
				.filter((n: string) => !actual.has(n))

			for (const name of toLeave) {
				try {
					echo.leave(name)
				} catch {}
			}
		}
	}, [groupId, chats, selectedChatId, currentUserId, qc])
}
