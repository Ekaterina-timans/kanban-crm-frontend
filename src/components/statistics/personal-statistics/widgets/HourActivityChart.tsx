'use client'

import { useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useWidgetStatistics } from '@/hooks/statistics/useWidgetStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

export function HourActivityChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data: stats, isLoading } = useWidgetStatistics(
		'hour_activity',
		period
	)

	if (isLoading) {
		return <SkeletonWidget type="chart-line" />
	}

	if (!stats) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				Нет данных для отображения
			</div>
		)
	}

	const hasActivity = Object.values(stats).some(v => Number(v) > 0)

	if (!hasActivity) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-blue-600'>
						Активность по часам
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-gray-500 text-center py-6'>
					Нет активности за выбранный период
				</p>
			</div>
		)
	}

	const formatted = Object.entries(stats).map(([hour, count]) => ({
		hour: `${hour}:00`,
		count
	}))

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-blue-600'>
					Активность по часам
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<ResponsiveContainer
				width='100%'
				height={280}
			>
				<BarChart data={formatted}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='hour' />
					<YAxis />
					<Tooltip />
					<Bar
						dataKey='count'
						fill='#60a5fa'
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
