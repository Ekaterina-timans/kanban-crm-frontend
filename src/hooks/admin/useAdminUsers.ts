import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { AdminUsersParams } from '@/types/admin-user.types'

import { adminUserService } from '@/services/admin-user.service'

// Список пользователей
export function useAdminUsers(params?: AdminUsersParams) {
	return useQuery({
		queryKey: ['admin-users', params],
		queryFn: () => adminUserService.getUsers(params)
	})
}

// Один пользователь
export function useAdminUser(userId?: number) {
	return useQuery({
		queryKey: ['admin-user', userId],
		queryFn: () => adminUserService.getUser(userId!),
		enabled: !!userId
	})
}

// Заблокировать
export function useBlockAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number) => adminUserService.blockUser(userId),
		onSuccess: (_data, userId) => {
			toast.success('Пользователь заблокирован')
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
			queryClient.invalidateQueries({ queryKey: ['admin-user', userId] })
		}
	})
}

// Разблокировать
export function useUnblockAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number) => adminUserService.unblockUser(userId),
		onSuccess: (_data, userId) => {
			toast.success('Пользователь активирован')
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
			queryClient.invalidateQueries({ queryKey: ['admin-user', userId] })
		}
	})
}

// Удалить пользователя
export function useDeleteAdminUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (userId: number) => adminUserService.deleteUser(userId),
		onSuccess: () => {
			toast.success('Пользователь удалён')
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
		}
	})
}
