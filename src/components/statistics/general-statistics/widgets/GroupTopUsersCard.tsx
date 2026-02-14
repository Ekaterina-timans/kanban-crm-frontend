'use client'

import { useState } from 'react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useGroupTopUsers } from '@/hooks/statistics/useGroupStatistics'

export function GroupTopUsersCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data, isLoading } = useGroupTopUsers(period)

	return (
		<div className='bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm h-full flex flex-col'>
			<div className='flex items-center justify-between mb-3'>
				<div>
					<h3 className='text-lg font-semibold text-primary'>
						Топ участников по активности
					</h3>
					<p className='text-xs text-muted-foreground'>
						Учитываются завершённые задачи и пункты чек-листов
					</p>
				</div>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			{isLoading && <SkeletonWidget type='card' />}

			{!isLoading && (!data || data.length === 0) && (
				<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
					Пока нет данных за выбранный период
				</div>
			)}

			{!isLoading && data && data.length > 0 && (
				<div className='flex-1 flex flex-col gap-4'>
					<div className='space-y-1 text-xs text-foreground'>
						{data.map(u => (
							<div
								key={u.user_id}
								className='flex items-center justify-between border border-border rounded-md px-2 py-1.5 bg-muted/30'
							>
								<div className='flex items-center gap-2'>
									<UserAvatar
										src={u.avatar}
										name={u.name}
										size={28}
										fallbackClassName='text-[11px]'
									/>
									<span className='font-medium text-sm'>{u.name}</span>
								</div>

								<div className='flex items-center gap-3'>
									<span className='text-xs text-muted-foreground'>
										Задачи:&nbsp;
										<span className='font-semibold text-foreground'>
											{u.tasks_done}
										</span>
									</span>

									<span className='text-xs text-muted-foreground'>
										Пункты в чек-листах:&nbsp;
										<span className='font-semibold text-foreground'>
											{u.checklist_done}
										</span>
									</span>

									<span className='text-xs text-primary font-semibold'>
										PI: {u.productivity_index}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
