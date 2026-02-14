import { useMutation, useQueryClient } from '@tanstack/react-query'

import { groupChannelService } from '@/services/group-channel.service'

export function useCreateTelegramChannel(groupId: string | number | null) {
	const qc = useQueryClient()
	const gid = groupId == null ? null : String(groupId)

	const m = useMutation({
		mutationFn: async () => {
			if (!gid) throw new Error('No group selected')
			return groupChannelService.create(gid, {
				provider: 'telegram',
				display_name: 'Telegram'
			})
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ['group-channels', gid] })
		}
	})

	return {
		createTelegram: () => m.mutateAsync(),
		isPending: m.isPending,
		error: m.error as unknown as Error | null
	}
}
