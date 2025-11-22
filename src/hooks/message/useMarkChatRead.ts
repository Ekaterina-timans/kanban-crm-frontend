import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { IChat } from '@/types/chat.type'

import { messageService } from '@/services/message.service'

export function useMarkChatRead(groupId: string | number | null) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			chatId,
			lastId
		}: {
			chatId: string | number
			lastId: number
		}) => messageService.markRead(chatId, lastId),
		onMutate: async ({ chatId }) => {
			const key = ['chats', String(groupId)]
			await qc.cancelQueries({ queryKey: key })
			const prev = qc.getQueryData<IChat[]>(key)
			if (prev) {
				qc.setQueryData<IChat[]>(
					key,
					prev.map(c => (c.id === chatId ? { ...c, unread_count: 0 } : c))
				)
			}
			return { prev }
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev) qc.setQueryData(['chats', String(groupId)], ctx.prev)
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: ['chats', String(groupId)] })
		}
	})
}
