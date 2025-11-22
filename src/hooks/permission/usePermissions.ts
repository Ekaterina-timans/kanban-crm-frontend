import { useQuery } from '@tanstack/react-query'

import { permissionService } from '@/services/permission.service'

export function usePermissions() {
	return useQuery({
		queryKey: ['permissions'],
		queryFn: () => permissionService.getAll(),
		staleTime: Infinity
	})
}
