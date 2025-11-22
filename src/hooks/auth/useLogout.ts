import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'

import { authService } from '@/services/auth.service'

export function useLogout() {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: logout, isPending } = useMutation({
		mutationFn: authService.logout,
		onSuccess() {
			queryClient.removeQueries({ queryKey: ['auth', 'profile'] })
			toast.success('Вы вышли из аккаунта!')
			router.push('/auth')
		},
		onError(error: any) {
			toast.error(error?.response?.data?.message || 'Ошибка выхода')
		}
	})

  return { logout, isPending }
}
