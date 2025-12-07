'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'

export function TasksSummaryCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics('tasks', period)

	if (isLoading) {
		return (
			<SkeletonWidget
				type='stats-grid'
				blocks={4}
			/>
		)
	}

	if (!stats) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				Нет данных для отображения
			</div>
		)
	}

	const isAllZero =
		(stats.total ?? 0) === 0 &&
		(stats.done ?? 0) === 0 &&
		(stats.active ?? 0) === 0 &&
		(stats.overdue ?? 0) === 0

	if (isAllZero) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-blue-600'>Задачи</h3>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-gray-500 text-center py-6'>
					Нет задач за выбранный период
				</p>
			</div>
		)
	}

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>Задачи</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<div className='grid grid-cols-2 gap-4 text-gray-700'>
				<div className='p-3 bg-blue-50 rounded-lg'>
					<p className='text-sm'>Всего</p>
					<p className='text-2xl font-bold'>{stats.total}</p>
				</div>

				<div className='p-3 bg-green-50 rounded-lg'>
					<p className='text-sm'>Завершено</p>
					<p className='text-2xl font-bold'>{stats.done}</p>
				</div>

				<div className='p-3 bg-yellow-50 rounded-lg'>
					<p className='text-sm'>Активных</p>
					<p className='text-2xl font-bold'>{stats.active}</p>
				</div>

				<div className='p-3 bg-red-50 rounded-lg'>
					<p className='text-sm'>Просрочено</p>
					<p className='text-2xl font-bold'>{stats.overdue}</p>
				</div>
			</div>
		</div>
	)
}
