import { useQuery } from '@tanstack/react-query'

import { userProfileService } from '@/services/user.service'

export function useUserProfile() {
	return useQuery({
		queryKey: ['user-profile'],
		queryFn: () => userProfileService.getProfile()
	})
}
