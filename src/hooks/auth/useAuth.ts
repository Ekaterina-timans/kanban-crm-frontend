import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { useAuth } from '@/providers/AuthProvider'

import { authService } from '@/services/auth.service'

export function useLogin() {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { checkAuth, user: currentUser } = useAuth()

	return useMutation({
		mutationFn: authService.login,
		async onSuccess(response) {
			const nextUser = response.data.user

			if (currentUser?.id && nextUser?.id && currentUser.id !== nextUser.id) {
				localStorage.removeItem('currentGroupId')
			}
			await checkAuth()

			queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
			toast.success('Аутентификация прошла успешно!')

			if (currentUser?.access_level === 'admin') {
				router.push('/admin')
			} else {
				router.push('/statistics')
			}
		},
		onError(error: any) {
			toast.error(error?.response?.data?.message || 'Ошибка входа')
		}
	})
}

export function useRegister() {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { checkAuth } = useAuth()

	return useMutation({
		mutationFn: authService.register,
		async onSuccess() {
			await checkAuth()
			queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
			toast.success('Регистрация прошла успешно!')
			router.push('/tasks')
		},
		onError(error: any) {
			toast.error(error?.response?.data?.message || 'Ошибка регистрации')
		}
	})
}
