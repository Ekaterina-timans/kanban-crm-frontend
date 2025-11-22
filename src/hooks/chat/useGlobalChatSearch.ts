import { chatService } from '@/services/chat.service'
import { useQuery } from '@tanstack/react-query'


export function useGlobalChatSearch(q: string) {
  const enabled = q.trim().length > 0
  return useQuery({
    queryKey: ['search-in-chat', q],
    queryFn: () => chatService.globalSearch(q.trim()),
    enabled,
    staleTime: 30_000,
    gcTime: 60_000,
  })
}
