import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { authService } from '@/services/auth.service'

export function useLogin() {
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: authService.login,
		onSuccess(response) {
			const user = response.data.user

			queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
			toast.success('Аутентификация прошла успешно!')

			if (user?.access_level === 'admin') {
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

	return useMutation({
		mutationFn: authService.register,
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
			toast.success('Регистрация прошла успешно!')
			router.push('/tasks')
		},
		onError(error: any) {
			toast.error(error?.response?.data?.message || 'Ошибка регистрации')
		}
	})
}
