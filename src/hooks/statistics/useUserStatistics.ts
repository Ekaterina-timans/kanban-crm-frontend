import { useQuery } from '@tanstack/react-query'

import { PeriodParams } from '@/components/ui/period-select/period'

import { useAuth } from '@/providers/AuthProvider'

import { UserStatistics } from '@/types/statistics.types'

import { statisticsPersonalService } from '@/services/statistics-personal.service'

export function useUserStatistics<T extends keyof UserStatistics>(
	widget: T,
	period: PeriodParams
) {
	const { currentGroupId, user } = useAuth()

	return useQuery({
		queryKey: ['widget', widget, currentGroupId, user?.id, period],
		enabled: !!currentGroupId && !!user?.id,
		queryFn: async () => {
			const res = await statisticsPersonalService.getStatistics(
				currentGroupId!,
				Number(user!.id),
				period
			)

			return res.data[widget] as UserStatistics[T]
		}
	})
}
