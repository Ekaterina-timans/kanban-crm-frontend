import { useQuery } from '@tanstack/react-query'

import { telegramChatService } from '@/services/telegram-chat.service'

export function useTelegramThreads(
	groupId: string | number | null | undefined,
	channelId: string | number | null | undefined,
) {
	return useQuery({
		queryKey: ['tgThreads', groupId, channelId],
		queryFn: () =>
			telegramChatService.listThreads({
				groupId: groupId!,
				channelId: channelId!,
				per_page: 50
			}),
		enabled: !!groupId && !!channelId,
		refetchInterval: 5000,
		refetchOnWindowFocus: true,
	})
}
