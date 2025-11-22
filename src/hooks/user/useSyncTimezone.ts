import { useEffect } from 'react'
import { useTimezoneStore } from '@/store/useTimezoneStore'
import { userPreferencesService } from '@/services/user-preferences.service'

export function useSyncTimezone() {
	const { setTimezone } = useTimezoneStore()

	useEffect(() => {
		async function sync() {
			try {
				const data = await userPreferencesService.getActual()
				if (data?.timezone) {
					setTimezone(data.timezone)
				}
			} catch (e) {
				console.warn('Не удалось синхронизировать часовой пояс')
			}
		}
		sync()
	}, [setTimezone])
}
