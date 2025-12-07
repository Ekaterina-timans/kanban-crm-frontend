'use client'

import { useMemo, useState } from 'react'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SelectComponent } from '@/components/ui/select/SelectComponent'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { GroupTasksDynamicsBySpace } from '@/types/statistics.types'

import { useGroupTasksDynamics } from '@/hooks/statistics/useGroupStatistics'

export function GroupTasksDynamicsBySpaceChart() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })
	const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)

	const { data, isLoading } = useGroupTasksDynamics(period)

	const spaces = (data ?? []) as GroupTasksDynamicsBySpace[]

	const effectiveSpaceId =
		selectedSpaceId ?? (spaces.length > 0 ? spaces[0].space_id : null)

	const currentSpace = useMemo(
		() => spaces.find(s => s.space_id === effectiveSpaceId) ?? spaces[0],
		[spaces, effectiveSpaceId]
	)

	const chartData = currentSpace?.dynamics ?? []

	const spaceOptions =
		spaces?.map(s => ({
			value: String(s.space_id),
			label: s.space_name
		})) ?? []

	if (isLoading) {
		return <SkeletonWidget type='chart-line' />
	}

	if (spaces.length === 0) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col'>
				<div className='flex items-center justify-between mb-3 gap-2'>
					<div>
						<h3 className='text-lg font-semibold text-blue-600'>
							Динамика задач по проектам
						</h3>
						<p className='text-xs text-gray-500'>
							Создано / завершено / баланс по дням
						</p>
					</div>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
					Нет данных по задачам за выбранный период
				</div>
			</div>
		)
	}

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col'>
			<div className='flex items-center justify-between mb-3 gap-2'>
				<div>
					<h3 className='text-lg font-semibold text-blue-600'>
						Динамика задач по проектам
					</h3>
					<p className='text-xs text-gray-500'>
						Создано / завершено / баланс по дням
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<div className='min-w-[180px]'>
						<SelectComponent
							options={spaceOptions}
							placeholder='Выберите проект'
							selectedValue={String(effectiveSpaceId)}
							onChange={value => setSelectedSpaceId(Number(value))}
							className='h-[32px] text-xs'
						/>
					</div>

					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>
			</div>

			<div className='h-64'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='day'
							tick={{ fontSize: 10 }}
							tickMargin={8}
						/>
						<YAxis
							tick={{ fontSize: 10 }}
							allowDecimals={false}
						/>
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='created'
							name='Создано'
							stroke='#2563eb'
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type='monotone'
							dataKey='done'
							name='Завершено'
							stroke='#16a34a'
							strokeWidth={2}
							dot={false}
						/>
						<Line
							type='monotone'
							dataKey='balance'
							name='Баланс'
							stroke='#f97316'
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
