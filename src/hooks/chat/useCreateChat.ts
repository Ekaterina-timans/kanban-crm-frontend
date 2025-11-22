import { useMutation, useQueryClient } from '@tanstack/react-query'

import { chatService } from '@/services/chat.service'

type Payload = {
	groupId: string | number
	type: 'group' | 'direct'
	title?: string
	participants: Array<string | number>
}

export function useCreateChat(currentGroupId: string | number | null) {
	const qc = useQueryClient()
	const gid = currentGroupId == null ? null : String(currentGroupId)

	const mutation = useMutation({
		mutationFn: (p: Payload) =>
			chatService.createChat(p.groupId, {
				type: p.type,
				title: p.title,
				participants: p.participants
			}),
		onSuccess: async (_created) => {
			await qc.invalidateQueries({ queryKey: ['chats', gid] })
		}
	})

	return {
		createChat: (p: Omit<Payload, 'groupId'>) => {
			if (!currentGroupId) throw new Error('No group selected')
			return mutation.mutateAsync({ ...p, groupId: currentGroupId })
		},
		isPending: mutation.isPending,
		error: mutation.error as unknown as Error | null
	}
}
