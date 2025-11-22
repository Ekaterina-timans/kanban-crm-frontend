import { chatService } from "@/services/chat.service"
import { useSelectedChat } from "@/store/useSelectedChat"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export function useDeleteChat(currentGroupId: string | number | null) {
  const qc = useQueryClient()
  const { selectedChatId, clearChat } = useSelectedChat()

  const m = useMutation({
    mutationFn: (chatId: string | number) => chatService.deleteChat(chatId),
    onSuccess: async (_res, chatId) => {
      // выкинуть выбранный чат, если его удалили
      if (String(selectedChatId) === String(chatId)) clearChat()
      // обновить список чатов
      if (currentGroupId) {
        await qc.invalidateQueries({ queryKey: ['chats', currentGroupId] })
      }
      // снести кеш конкретного чата и его сообщений
      await qc.invalidateQueries({ queryKey: ['chat', String(chatId)] })
      await qc.invalidateQueries({ queryKey: ['messages', String(chatId)] })
    },
  })

  return m
}
