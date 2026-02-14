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
			<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
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
			<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-primary'>Задачи</h3>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-muted-foreground text-center py-6'>
					Нет задач за выбранный период
				</p>
			</div>
		)
	}

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-primary'>Задачи</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div className='p-3 rounded-lg border border-border bg-[hsl(var(--info))]'>
					<p className='text-sm text-[hsl(var(--info-foreground))]'>Всего</p>
					<p className='text-2xl font-bold text-[hsl(var(--info-foreground))]'>
						{stats.total}
					</p>
				</div>

				<div className='p-3 rounded-lg border border-border bg-[hsl(var(--success))]'>
					<p className='text-sm text-[hsl(var(--success-foreground))]'>
						Завершено
					</p>
					<p className='text-2xl font-bold text-[hsl(var(--success-foreground))]'>
						{stats.done}
					</p>
				</div>

				<div className='p-3 rounded-lg border border-border bg-[hsl(var(--warning))]'>
					<p className='text-sm text-[hsl(var(--warning-foreground))]'>
						Активных
					</p>
					<p className='text-2xl font-bold text-[hsl(var(--warning-foreground))]'>
						{stats.active}
					</p>
				</div>

				<div className='p-3 rounded-lg border border-border bg-[hsl(var(--danger))]'>
					<p className='text-sm text-[hsl(var(--danger-foreground))]'>
						Просрочено
					</p>
					<p className='text-2xl font-bold text-[hsl(var(--danger-foreground))]'>
						{stats.overdue}
					</p>
				</div>
			</div>
		</div>
	)
}
