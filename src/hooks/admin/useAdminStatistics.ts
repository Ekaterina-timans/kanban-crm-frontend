import { useQuery } from '@tanstack/react-query'

import { AdminPeriod } from '@/types/admin-statistics.types'

import { adminStatisticsService } from '@/services/admin-statistics.service'

// 1. Всего пользователей
export function useAdminUsersTotal() {
	return useQuery({
		queryKey: ['admin-users-total'],
		queryFn: () => adminStatisticsService.usersTotal()
	})
}

// 2. Заблокированные пользователи
export function useAdminUsersBlocked() {
	return useQuery({
		queryKey: ['admin-users-blocked'],
		queryFn: () => adminStatisticsService.usersBlocked()
	})
}

// 3. Всего групп
export function useAdminGroupsTotal() {
	return useQuery({
		queryKey: ['admin-groups-total'],
		queryFn: () => adminStatisticsService.groupsTotal()
	})
}

// 4. Активные / пассивные группы
export function useAdminGroupsActivity(period: {
	period?: AdminPeriod
	date_from?: string
	date_to?: string
}) {
	return useQuery({
		queryKey: ['admin-groups-activity', period],
		queryFn: () => adminStatisticsService.groupsActivity(period),
		enabled: !!period?.period
	})
}

// 5. Пассивные группы
export function useAdminInactiveGroups(period: {
	period?: AdminPeriod
	date_from?: string
	date_to?: string
}) {
	return useQuery({
		queryKey: ['admin-inactive-groups', period],
		queryFn: () => adminStatisticsService.inactiveGroups(period),
		enabled: !!period?.period
	})
}
