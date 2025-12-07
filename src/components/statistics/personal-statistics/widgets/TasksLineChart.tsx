'use client'

import { useState } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'

export function TasksLineChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics('tasks', period)

	if (isLoading) {
		return <SkeletonWidget type='chart-line' />
	}

	if (!stats) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				Нет данных для отображения
			</div>
		)
	}

	if (!stats.history || stats.history.length === 0) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-blue-600'>
						Выполненные задачи (по дням)
					</h3>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-gray-500 text-center py-6'>
					Нет выполненных задач за выбранный период
				</p>
			</div>
		)
	}

	const data = stats.history.map(h => ({
		day: h.day,
		count: h.count
	}))

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Выполненные задачи (по дням)
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<ResponsiveContainer
				width='100%'
				height={250}
			>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='day' />
					<YAxis />
					<Tooltip />
					<Line
						type='monotone'
						dataKey='count'
						stroke='#2563eb'
						strokeWidth={3}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}
