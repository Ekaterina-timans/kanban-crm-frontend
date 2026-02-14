import { useQuery } from '@tanstack/react-query'
import { groupChannelService } from '@/services/group-channel.service'

export function useGroupChannels(groupId: string | number | null) {
  const gid = groupId == null ? null : String(groupId)

  const q = useQuery({
    queryKey: ['group-channels', gid],
    queryFn: () => groupChannelService.list(String(gid)),
    enabled: !!gid,
    staleTime: 15_000
  })

  return {
    channels: q.data ?? [],
    isLoading: q.isLoading,
    error: q.error as unknown as Error | null
  }
}
