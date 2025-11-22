import { messageService } from "@/services/message.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export function useSendMessage(chatId: string | number | null) {
  const id = chatId == null ? null : String(chatId)

  const m = useMutation({
    mutationFn: (payload: {
      content?: string
      kind?: 'text' | 'system' | 'poll'
      reply_to_id?: number
      meta?: any
      files?: File[]
      mentioned_user_ids?: Array<number | string>
    }) => {
      if (!id) throw new Error('Chat is not selected')
      return messageService.send(id, payload)
    },
    onSuccess: (msg, _payload) => {
      if (!id) return
      // Сообщаем хуку useChatMessages
      window.dispatchEvent(new CustomEvent('chat:messageSent', { detail: { chatId: id, message: msg } }))
    },
  })

  return m
}
