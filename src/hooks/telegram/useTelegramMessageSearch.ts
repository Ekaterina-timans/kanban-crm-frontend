import { useQuery } from '@tanstack/react-query'
import { telegramChatService } from '@/services/telegram-chat.service'

export function useTelegramMessageSearch(
  threadId: string | number | null | undefined,
  q: string
) {
  const qq = q.trim()

  return useQuery({
    queryKey: ['tgMessageSearch', threadId, qq],
    queryFn: () =>
      telegramChatService.searchMessages({
        threadId: threadId!,
        q: qq,
        limit: 100
      }),
    enabled: !!threadId && qq.length > 0,
    staleTime: 0
  })
}
