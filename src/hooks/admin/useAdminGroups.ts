import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { adminGroupService } from '@/services/admin-group.service'

// Список групп
export function useAdminGroups(params?: {
	q?: string
	status?: 'active' | 'passive'
	sort?: 'activity'
	page?: number
}) {
	return useQuery({
		queryKey: ['admin-groups', params],
		queryFn: () => adminGroupService.getGroups(params)
	})
}

// Детали группы
export function useAdminGroup(groupId?: number) {
	return useQuery({
		queryKey: ['admin-group', groupId],
		queryFn: () => adminGroupService.getGroup(groupId!),
		enabled: !!groupId
	})
}

// Удалить группу
export function useDeleteAdminGroup() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (groupId: number) => adminGroupService.deleteGroup(groupId),
		onSuccess: () => {
			toast.success('Группа удалена')
			queryClient.invalidateQueries({ queryKey: ['admin-groups'] })
		}
	})
}
