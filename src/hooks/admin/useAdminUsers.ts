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

// Назначить пользователя админом
export function usePromoteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => adminUserService.promoteUser(userId),
    onSuccess: (data, userId) => {
      toast.success(data.message || 'Пользователь назначен администратором')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user', userId] })
    },
    onError: () => toast.error('Ошибка при назначении админа')
  })
}

// Снять админа приложения
export function useDemoteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => adminUserService.demoteUser(userId),
    onSuccess: (data, userId) => {
      toast.success(data.message || 'Права администратора сняты')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user', userId] })
    },
    onError: () => toast.error('Ошибка при снятии админа')
  })
}

// Блокировка пользователя в конкретной группе
export function useBlockUserInGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: number; groupId: number }) =>
      adminUserService.blockUserInGroup(userId, groupId),
    onSuccess: (data, vars) => {
      toast.success(data.message || 'Пользователь заблокирован в группе')
      queryClient.invalidateQueries({ queryKey: ['admin-user', vars.userId] })
    },
    onError: () => toast.error('Ошибка при блокировке в группе')
  })
}

// Разблокировка пользователя в конкретной группе
export function useUnblockUserInGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: number; groupId: number }) =>
      adminUserService.unblockUserInGroup(userId, groupId),
    onSuccess: (data, vars) => {
      toast.success(data.message || 'Пользователь разблокирован в группе')
      queryClient.invalidateQueries({ queryKey: ['admin-user', vars.userId] })
    },
    onError: () => toast.error('Ошибка при разблокировке в группе')
  })
}