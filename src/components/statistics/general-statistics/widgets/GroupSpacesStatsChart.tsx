'use client'

import { useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useGroupSpacesStats } from '@/hooks/statistics/useGroupStatistics'

export function GroupSpacesStatsChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data, isLoading } = useGroupSpacesStats(period)

	const chartData =
		data?.map(space => ({
			name: space.space_name,
			created: space.created,
			done: space.done,
			net: space.net
		})) ?? []

	if (isLoading) {
		return <SkeletonWidget type='chart-line' />
	}

	if (!data || data.length === 0) {
		return (
			<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
				<div className='flex justify-between items-center mb-3'>
					<h3 className='text-lg font-semibold text-primary'>
						Самые активные проекты
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>
				<p className='text-sm text-muted-foreground text-center py-6'>
					Нет данных для выбранного периода
				</p>
			</div>
		)
	}

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
			<div className='flex justify-between items-center mb-3'>
				<h3 className='text-lg font-semibold text-primary'>
					Самые активные проекты
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
				<BarChart data={chartData}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar
						dataKey='created'
						name='Создано'
						fill='#3b82f6'
					/>
					<Bar
						dataKey='done'
						name='Завершено'
						fill='#22c55e'
					/>
					<Bar
						dataKey='net'
						name='Баланс (созд. - закр.)'
						fill='#f97316'
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
