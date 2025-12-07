'use client'

import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

const COLORS = ['#4ade80', '#60a5fa', '#f87171']

export function ChecklistPieChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics('checklist', period)

	if (isLoading) {
		return <SkeletonWidget type="chart-pie" />
	}

	if (!stats) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				Нет данных для отображения
			</div>
		)
	}

	const { total, done, overdue } = stats

	if (total === 0) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-blue-600'>
						Пункты в чек-листах
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-gray-500 text-center py-6'>
					Нет пунктов чек-листа за выбранный период
				</p>
			</div>
		)
	}

	const remaining = Math.max(total - done, 0)
	const remainingClean = Math.max(remaining - overdue, 0)

	const data = [
		{ name: 'Выполнено', value: done },
		{ name: 'Осталось', value: remainingClean },
		{ name: 'Просрочено', value: overdue }
	]

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Пункты в чек-листах
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
						{data.map((_, index) => (
							<Cell
								key={index}
								fill={COLORS[index]}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>

			<p className='text-xs text-gray-500 mt-2'>
				*Просроченные входят в «Осталось», но выделены отдельно.
			</p>
		</div>
	)
}
