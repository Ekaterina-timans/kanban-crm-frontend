import { chatService } from "@/services/chat.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useLeaveChat() {
	const qc = useQueryClient()

	const m = useMutation({
		mutationFn: (chatId: string | number) => chatService.leaveChat(chatId),
		onSuccess: async (_res, chatId) => {
      toast.success('Вы вышли из чата')
			// выбросим событие для локальных слушателей
			window.dispatchEvent(new CustomEvent('chat:left', { detail: { chatId } }))

			// обновим кеш
			await qc.invalidateQueries({ queryKey: ['chats'] })
			await qc.invalidateQueries({ queryKey: ['chat', String(chatId)] })
			await qc.invalidateQueries({ queryKey: ['messages', String(chatId)] })
		},
    onError: () => {
			toast.error('Не удалось выйти из чата')
		}
	})

	return m
}