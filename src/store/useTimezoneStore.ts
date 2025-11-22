import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

dayjs.extend(utc)
dayjs.extend(timezone)

interface TimezoneState {
	timezone: string
	setTimezone: (tz: string) => void
	resetTimezone: () => void
}

export const useTimezoneStore = create<TimezoneState>()(
	persist(
		set => ({
			timezone: dayjs.tz.guess(), // дефолт — локальный
			setTimezone: tz => set({ timezone: tz }),
			resetTimezone: () => set({ timezone: dayjs.tz.guess() })
		}),
		{
			name: 'user-timezone' // ключ в localStorage
		}
	)
)
