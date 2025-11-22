import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isTodayPlugin from 'dayjs/plugin/isToday'
import isYesterdayPlugin from 'dayjs/plugin/isYesterday'
import { useTimezoneStore } from "@/store/useTimezoneStore"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isTodayPlugin)
dayjs.extend(isYesterdayPlugin)

/** Время HH:mm */
export function formatTime(iso?: string | null): string {
	if (!iso) return ''
	const tz = useTimezoneStore.getState().timezone
	const d = dayjs.utc(iso).tz(tz)
	return d.isValid() ? d.format('HH:mm') : ''
}

/** Формат: 2025-01-23 12:33:11 */
export function formatDate(date: Date | undefined): string | null {
	if (!date) return null
	const tz = useTimezoneStore.getState().timezone
	return dayjs(date).tz(tz).format('YYYY-MM-DD HH:mm:ss')
}

/** Формат: 23.01.2025 */
export function formatDateForCard(dateString?: string | null): string {
	if (!dateString) return ''
	const tz = useTimezoneStore.getState().timezone
	const d = dayjs(dateString).tz(tz)
	return d.format('DD.MM.YYYY')
}

export function dateSeparatorLabel(iso?: string | null): string {
  if (!iso) return ''
  const tz = useTimezoneStore.getState().timezone
  const d = dayjs.utc(iso).tz(tz)
  if (!d.isValid()) return ''
  if (d.isToday()) return 'Сегодня'
  if (d.isYesterday()) return 'Вчера'
  return d.format('DD.MM.YYYY')
}

/** 
 * Для истории действий:
 * Сегодня, 12:30
 * Вчера, 18:10
 * 10.11.2025, 09:15
 */
export function formatActivityDateTime(iso?: string | null): string {
	if (!iso) return ''

	const tz = useTimezoneStore.getState().timezone
	const d = dayjs.utc(iso).tz(tz)

	if (!d.isValid()) return ''

	const today = dayjs().tz(tz).startOf('day')
	const yesterday = today.subtract(1, 'day')

	const time = d.format('HH:mm')

	if (d.isSame(today, 'day')) {
		return `Сегодня, ${time}`
	}

	if (d.isSame(yesterday, 'day')) {
		return `Вчера, ${time}`
	}

	return `${d.format('DD.MM.YYYY')}, ${time}`
}