import { useQuery } from '@tanstack/react-query'

import { telegramChatService } from '@/services/telegram-chat.service'

export function useTelegramGlobalSearch(
	groupId: string | number | null | undefined,
	channelId: string | number | null | undefined,
	q: string
) {
	const query = q.trim()

	return useQuery({
		queryKey: ['tgSearch', groupId, channelId, query],
		queryFn: () =>
			telegramChatService.searchChannel({
				groupId: groupId!,
				channelId: channelId!,
				q: query,
				limit_threads: 20,
				limit_messages: 50
			}),
		enabled: !!groupId && !!channelId && query.length > 0,
		staleTime: 5_000
	})
}
