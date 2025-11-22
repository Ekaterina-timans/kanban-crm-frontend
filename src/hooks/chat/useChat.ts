import { useQuery } from '@tanstack/react-query'

import { IChat } from '@/types/chat.type'

import { chatService } from '@/services/chat.service'

export function useChat(chatId: string | number | null) {
	const id = chatId == null ? null : String(chatId)
	const { data, isLoading } = useQuery({
		queryKey: ['chat', id],
		queryFn: () => chatService.getChat(String(id)),
		enabled: !!id,
		staleTime: 30_000
	})
	return { chat: data as IChat, isLoading }
}
