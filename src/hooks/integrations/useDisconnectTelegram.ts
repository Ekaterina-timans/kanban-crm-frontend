import { useMutation, useQueryClient } from '@tanstack/react-query'

import { groupChannelService } from '@/services/group-channel.service'

export function useDisconnectTelegram(currentGroupId: string | number | null) {
	const qc = useQueryClient()
	const gid = currentGroupId == null ? null : String(currentGroupId)

	const mutation = useMutation({
		mutationFn: (p: { channelId: string | number }) => {
			if (!currentGroupId) throw new Error('No group selected')
			return groupChannelService.disconnectTelegram(currentGroupId, p.channelId)
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ['group-channels', gid] })
		}
	})

	return {
		disconnectTelegram: (p: { channelId: string | number }) =>
			mutation.mutateAsync(p),
		isPending: mutation.isPending,
		error: mutation.error as unknown as Error | null
	}
}
