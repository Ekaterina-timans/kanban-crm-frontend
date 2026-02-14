import { useQuery } from '@tanstack/react-query'

import { telegramChatService } from '@/services/telegram-chat.service'

export function useTelegramMessages(
	threadId: string | number | null | undefined
) {
	return useQuery({
		queryKey: ['tgMessages', threadId],
		queryFn: () =>
			telegramChatService.listMessages({
				threadId: threadId!,
				per_page: 50
			}),
		enabled: !!threadId,
		refetchInterval: threadId ? 2500 : false
	})
}
