'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

export function ProductivityIndexCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: index, isLoading } = useWidgetStatistics(
		'productivity_index',
		period
	)

	if (isLoading || index === undefined) {
		return <SkeletonWidget type="card" />
	}

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-2'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Индекс продуктивности
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<p className='text-5xl font-bold text-purple-600'>{index}</p>

			<p className='text-sm text-gray-500 mt-2 leading-5'>
				Индекс рассчитывается так:
				<br />
				<b>+3 балла</b> за каждую завершённую задачу.
				<br />
				<b>+1 балл</b> за каждый выполненный пункт чек-листа.
				<br />
				Итог — ваш общий показатель эффективности за выбранный период.
			</p>
		</div>
	)
}
