import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { userProfileService } from '@/services/user.service'

export function useUpdateUserProfile() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (formData: FormData) =>
			userProfileService.updateProfile(formData),
		onSuccess: data => {
			toast.success('Профиль обновлён')
			queryClient.setQueryData(['user-profile'], data)
		},
		onError: () => {
			toast.error('Ошибка при обновлении профиля')
		}
	})
}
