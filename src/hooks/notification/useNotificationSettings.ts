import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { INotificationSettings } from '@/types/notification-settings.types'

import { notificationSettingsService } from '@/services/notification-settings.service'

export function useNotificationSettings() {
	const qc = useQueryClient()

	const query = useQuery({
		queryKey: ['notification-settings'],
		queryFn: () => notificationSettingsService.get()
	})

	const mutation = useMutation({
		mutationFn: (payload: Partial<INotificationSettings>) =>
			notificationSettingsService.update(payload),
		onSuccess: data => {
			qc.setQueryData(['notification-settings'], data)
			toast.success('Настройки сохранены')
		},
		onError: () => {
			toast.error('Не удалось сохранить настройки')
		}
	})

	return { query, mutation }
}
