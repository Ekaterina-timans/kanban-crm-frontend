import { useQuery } from '@tanstack/react-query'

import { spaceUserService } from '@/services/space-user.service'

export function getUserRights(spaceUserId?: string) {
	return useQuery({
		queryKey: ['space-user', spaceUserId],
		queryFn: () => spaceUserService.getUserRightsById(spaceUserId!),
		enabled: !!spaceUserId
	})
}
