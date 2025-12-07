'use client'

import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

const COLORS = ['#93c5fd', '#facc15', '#f87171']

export function PriorityPieChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics(
		'task_priorities',
		period
	)

	if (isLoading) {
		return <SkeletonWidget type='chart-pie' />
	}

	if (!stats) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				Нет данных для отображения
			</div>
		)
	}

	const data = [
		{ name: 'Несущественно', value: stats.low || 0 },
		{ name: 'Важно', value: stats.medium || 0 },
		{ name: 'Срочно', value: stats.high || 0 }
	]

	const total = data.reduce((sum, d) => sum + d.value, 0)

	if (total === 0) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-blue-600'>
						Приоритеты задач
					</h3>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-gray-500 text-center py-6'>
					Нет данных за выбранный период
				</p>
			</div>
		)
	}

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Приоритеты задач
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<ResponsiveContainer
				width='100%'
				height={260}
			>
				<PieChart>
					<Pie
						data={data}
						dataKey='value'
						nameKey='name'
						outerRadius={80}
						label
					>
						{data.map((entry, index) => (
							<Cell
								key={index}
								fill={COLORS[index]}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
