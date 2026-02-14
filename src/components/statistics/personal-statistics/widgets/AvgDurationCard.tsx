'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'

export function AvgDurationCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics('tasks', period)

	if (isLoading || !stats) {
		return <SkeletonWidget type='card' />
	}

	const avg = stats.avg_duration_hours
	const hasData = avg > 0

	const days = Math.floor(avg / 24)
	const hours = Math.round(avg % 24)

	const formatted = days > 0 ? `${days} д ${hours} ч` : `${hours || avg} ч`

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm flex flex-col'>
			<div className='flex items-center justify-between mb-2'>
				<h3 className='text-lg font-semibold text-primary'>
					Среднее время выполнения задачи
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			{hasData ? (
				<>
					<p className='text-3xl font-bold text-foreground'>≈ {formatted}</p>
					<p className='text-sm text-muted-foreground mt-2'>
						Среднее время между созданием и завершением задачи.
					</p>
				</>
			) : (
				<p className='text-sm text-muted-foreground text-center py-6'>
					Пока нет завершённых задач
				</p>
			)}
		</div>
	)
}
