import { useAuth } from '@/providers/AuthProvider'

import { authService } from '@/services/auth.service'

export function useRefreshUser() {
	const { setUser } = useAuth()

	async function refreshUser() {
		try {
			const { user } = await authService.getProfile()
			setUser(user)
		} catch (err) {
			console.warn('Не удалось обновить данные пользователя', err)
		}
	}

	return { refreshUser }
}
