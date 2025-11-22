import { useQuery } from '@tanstack/react-query'

import { spaceUserService } from '@/services/space-user.service'

export const useGetSpaceUsers = (spaceId: string) => {
	return useQuery({
		queryKey: ['space-users', spaceId],
		queryFn: () => spaceUserService.getSpaceUsers(spaceId),
		enabled: !!spaceId
	})
}
