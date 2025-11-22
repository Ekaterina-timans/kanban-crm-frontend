import { useQuery } from '@tanstack/react-query'

import { groupService } from '@/services/group.service'

export function useGroup(groupId?: string | null) {
	return useQuery({
		queryKey: ['group', groupId],
		queryFn: () => groupService.getGroupById(String(groupId)),
		enabled: Boolean(groupId)
	})
}
