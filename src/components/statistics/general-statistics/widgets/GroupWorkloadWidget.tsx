'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { Progress } from '@/components/ui/progress/progress'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { GroupWorkloadItemWithTotal } from '@/types/statistics.types'

import { useGroupWorkload } from '@/hooks/statistics/useGroupStatistics'

export function GroupWorkloadWidget() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'week' })

	const { data, isLoading } = useGroupWorkload(period)

	if (isLoading || !data) {
		return <SkeletonWidget type='card' />
	}

	if (!data.length) {
		return (
			<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-primary'>
						Загруженность участников
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>

				<p className='text-sm text-muted-foreground'>
					В группе нет данных по загруженности.
				</p>
			</div>
		)
	}

	const itemsWithTotal: GroupWorkloadItemWithTotal[] = data.map(u => ({
		...u,
		total: u.active_tasks + u.due_soon_tasks + u.checklist_active
	}))

	const sorted = [...itemsWithTotal].sort((a, b) => b.total - a.total)
	const maxTotal = sorted[0]?.total || 1

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-lg font-semibold text-primary'>
					Загруженность участников
				</h3>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<p className='text-xs text-muted-foreground mb-2'>
				Показаны все участники, у которых есть активные задачи, дедлайны или
				невыполненные чек-листы.
			</p>

			<ScrollArea className='h-56 mt-2'>
				<div className='space-y-3 pr-2'>
					{sorted.map(user => {
						const percent = (user.total / maxTotal) * 100

						return (
							<div
								key={user.user_id}
								className='flex flex-col gap-1 border border-border rounded-md p-2'
							>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium text-foreground truncate'>
										{user.name}
									</span>

									<span className='text-xs text-muted-foreground'>
										Всего: <span className='font-semibold'>{user.total}</span>
									</span>
								</div>

								<div className='flex items-center justify-between text-[11px] text-muted-foreground'>
									<span>Активные: {user.active_tasks}</span>
									<span>Задачи сроком &lt; 7 дней: {user.due_soon_tasks}</span>
									<span>Пункты чек-листов: {user.checklist_active}</span>
								</div>

								<Progress
									value={percent}
									indicatorColor='bg-blue-500'
									className='h-2 mt-1'
								/>
							</div>
						)
					})}
				</div>
			</ScrollArea>
		</div>
	)
}
