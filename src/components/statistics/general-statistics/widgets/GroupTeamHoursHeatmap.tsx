'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useGroupTeamHours } from '@/hooks/statistics/useGroupStatistics'

const WEEKDAY_MAP: Record<string, string> = {
	Mon: 'Пн',
	Tue: 'Вт',
	Wed: 'Ср',
	Thu: 'Чт',
	Fri: 'Пт',
	Sat: 'Сб',
	Sun: 'Вс'
}

function intensityClass(value: number, max: number): string {
	if (max === 0 || value === 0) return 'bg-muted text-muted-foreground'
	const ratio = value / max

	if (ratio > 0.75) return 'bg-primary text-primary-foreground'
	if (ratio > 0.5) return 'bg-primary/80 text-primary-foreground'
	if (ratio > 0.25) return 'bg-primary/40 text-foreground'

	return 'bg-primary/20 text-foreground'
}

export function GroupTeamHoursHeatmap() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'week' })

	const { data, isLoading } = useGroupTeamHours(period)

	if (isLoading) {
		return <SkeletonWidget type='card' />
	}

	if (!data) {
		return (
			<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
				<div className='flex justify-between items-center mb-3'>
					<h3 className='text-lg font-semibold text-primary'>
						Рабочие часы команды
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>
				<p className='text-sm text-muted-foreground text-center py-6'>
					Нет данных
				</p>
			</div>
		)
	}

	const { matrix, weekdays, hours } = data
	const flatMax = Math.max(0, ...matrix.flat().map(v => Number(v) || 0))

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
			<div className='flex justify-between items-center mb-3'>
				<h3 className='text-lg font-semibold text-primary'>
					Рабочие часы команды
				</h3>
				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<p className='text-xs text-muted-foreground mb-3'>
				Интенсивность активности по дням недели и часам.
			</p>

			<div className='overflow-auto'>
				<table className='text-[10px] border-collapse'>
					<thead>
						<tr>
							<th className='px-2 py-1 text-left text-muted-foreground'>
								День / час
							</th>
							{hours.map(h => (
								<th
									key={h}
									className='px-1 py-1 text-center text-muted-foreground/70 min-w-[20px]'
								>
									{h}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{matrix.map((row, w) => {
							const english = weekdays[w]
							const russian = WEEKDAY_MAP[english] ?? english

							return (
								<tr key={w}>
									<td className='px-2 py-1 text-muted-foreground whitespace-nowrap'>
										{russian}
									</td>

									{row.map((value, h) => (
										<td
											key={h}
											className={`px-1 py-1 text-center align-middle ${intensityClass(
												value,
												flatMax
											)} cursor-default`}
											title={`${russian}, ${h}:00 — событий: ${value}`}
										>
											{value > 0 ? value : ''}
										</td>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<div className='mt-3 text-xs text-muted-foreground'>
				Чем темнее ячейка, тем больше активности в это время.
			</div>
		</div>
	)
}
