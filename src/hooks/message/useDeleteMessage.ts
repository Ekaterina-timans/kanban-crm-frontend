import { useMutation, useQueryClient } from '@tanstack/react-query'

import { messageService } from '@/services/message.service'

export function useDeleteMessage(chatId: string | number | null) {
	const qc = useQueryClient()
	const id = chatId == null ? null : String(chatId)

	return useMutation({
		mutationFn: async (messageId: number | string) => {
			if (!id) throw new Error('Chat is not selected')
			await messageService.delete(id, messageId)
			return { messageId }
		},
		onSuccess: ({ messageId }) => {
			if (!id) return
			window.dispatchEvent(
				new CustomEvent('chat:messageDeleted', {
					detail: { chatId: id, messageId }
				})
			)
			qc.invalidateQueries({ queryKey: ['messages', id] })
			qc.invalidateQueries({ queryKey: ['chat', id] })
			qc.invalidateQueries({ queryKey: ['chats'] })
		}
	})
}
