import { useQuery } from '@tanstack/react-query'

import { PeriodParams } from '@/components/ui/period-select/period'

import { useAuth } from '@/providers/AuthProvider'

import {
	GroupOverdueStats,
	GroupSpaceStats,
	GroupTasksDynamicsBySpace,
	GroupTeamHours,
	GroupTopUser,
	GroupWorkloadItem
} from '@/types/statistics.types'

import { statisticsGeneralService } from '@/services/statistics-general.service'

// 1. ТОП-участников
export function useGroupTopUsers(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-top-users', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupTopUser[]> => {
			const res = await statisticsGeneralService.getGroupTopUsers(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}

// 2. Динамика задач по space'ам
export function useGroupTasksDynamics(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-tasks-dynamics', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupTasksDynamicsBySpace[]> => {
			const res = await statisticsGeneralService.getGroupTasksDynamics(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}

// 3. Загруженность участников
export function useGroupWorkload(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-workload', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupWorkloadItem[]> => {
			const res = await statisticsGeneralService.getGroupWorkload(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}

// 4. Статистика по space'ам
export function useGroupSpacesStats(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-spaces-stats', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupSpaceStats[]> => {
			const res = await statisticsGeneralService.getGroupSpacesStats(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}

// 5. Просрочки
export function useGroupOverdue(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-overdue', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupOverdueStats> => {
			const res = await statisticsGeneralService.getGroupOverdue(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}

// 6. Рабочие часы команды
export function useGroupTeamHours(period: PeriodParams) {
	const { currentGroupId } = useAuth()

	return useQuery({
		queryKey: ['group-team-hours', currentGroupId, period],
		enabled: !!currentGroupId,
		queryFn: async (): Promise<GroupTeamHours> => {
			const res = await statisticsGeneralService.getGroupTeamHours(
				currentGroupId!,
				period
			)
			return res.data
		}
	})
}
