import { chatService } from "@/services/chat.service"
import { IChat } from "@/types/chat.type"
import { useQuery } from "@tanstack/react-query"

export function useGroupChats(groupId: string | number | null, enabled = true) {
  const gid = groupId == null ? null : String(groupId)
  const isEnabled = !!groupId && enabled

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['chats', gid],
    queryFn: () => chatService.getGroupChats(String(groupId)),
    enabled: isEnabled,
    staleTime: 30_000,
  })

  return {
    chats: (data ?? []) as IChat[],
    isLoading,
    isError,
    refetch,
  }
}