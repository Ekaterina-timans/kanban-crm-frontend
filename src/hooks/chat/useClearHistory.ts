import { chatService } from "@/services/chat.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useClearHistory() {
  const qc = useQueryClient()

  const m = useMutation({
    mutationFn: (chatId: string | number) => chatService.clearHistory(chatId),
    onSuccess: async (_res, chatId) => {
      window.dispatchEvent(new CustomEvent('chat:cleared', { detail: { chatId } }))
      // очистить кеш сообщений
      await qc.invalidateQueries({ queryKey: ['messages', String(chatId)] })
      // и, на всякий, сам чат (last_message_id сброшен)
      await qc.invalidateQueries({ queryKey: ['chat', String(chatId)] })
    },
  })

  return m
}
