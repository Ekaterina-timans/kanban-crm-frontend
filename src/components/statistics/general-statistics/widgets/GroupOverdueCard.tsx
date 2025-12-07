'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'

import { useGroupOverdue } from '@/hooks/statistics/useGroupStatistics'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

export function GroupOverdueCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data, isLoading } = useGroupOverdue(period)

	if (isLoading) {
		return <SkeletonWidget type="card" />
	}

	if (!data) {
		return (
			<div className='bg-white border rounded-lg p-4 shadow-sm'>
				<div className='flex justify-between items-center mb-3'>
					<h3 className='text-lg font-semibold text-red-600'>
						Проблемные зоны (просрочки)
					</h3>
					<PeriodSelect
						value={period}
						onChange={setPeriod}
					/>
				</div>
				<p className='text-sm text-gray-500 text-center py-6'>Нет данных</p>
			</div>
		)
	}

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm'>
			<div className='flex justify-between items-center mb-3'>
				<h3 className='text-lg font-semibold text-red-600'>
					Проблемные зоны (просроченные задачи)
				</h3>
				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			<div className='mb-4'>
				<p className='text-sm text-gray-700'>
					Всего просроченных задач:{' '}
					<span className='font-semibold text-red-600'>
						{data.total_overdue}
					</span>
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm max-h-72 overflow-y-auto pr-2'>
				<div>
					<h4 className='font-semibold mb-2 text-gray-800'>По участникам</h4>

					{data.by_user.length === 0 ? (
						<p className='text-gray-400 text-xs'>
							Нет просрочек по участникам.
						</p>
					) : (
						<ul className='space-y-1'>
							{data.by_user.map(user => (
								<li
									key={user.user_id}
									className='flex justify-between items-center'
								>
									<span className='truncate max-w-[70%]'>{user.name}</span>
									<span className='font-semibold text-red-500'>
										{user.overdue}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<div>
					<h4 className='font-semibold mb-2 text-gray-800'>По проектам</h4>

					{data.by_space.length === 0 ? (
						<p className='text-gray-400 text-xs'>Нет просрочек по проектам.</p>
					) : (
						<ul className='space-y-1'>
							{data.by_space.map(space => (
								<li
									key={space.space_id}
									className='flex justify-between items-center'
								>
									<span className='truncate max-w-[70%]'>
										{space.space_name}
									</span>
									<span className='font-semibold text-red-500'>
										{space.overdue}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
