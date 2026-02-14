import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupChannelService } from '@/services/group-channel.service'

export function useConnectTelegram(groupId: string | number | null) {
  const qc = useQueryClient()
  const gid = groupId == null ? null : String(groupId)

  const m = useMutation({
    mutationFn: async (p: { channelId: string | number; bot_token: string }) => {
      if (!gid) throw new Error('No group selected')
      return groupChannelService.connectTelegram(gid, p.channelId, {
        bot_token: p.bot_token
      })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['group-channels', gid] })
    }
  })

  return {
    connectTelegram: m.mutateAsync,
    isPending: m.isPending,
    error: m.error as unknown as Error | null
  }
}