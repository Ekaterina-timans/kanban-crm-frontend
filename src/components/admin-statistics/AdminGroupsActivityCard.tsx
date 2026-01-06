'use client'

import { useState } from 'react'

import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { useAdminGroupsActivity } from '@/hooks/admin/useAdminStatistics'

export function AdminGroupsActivityCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data, isLoading } = useAdminGroupsActivity(period)

	const total = data?.total ?? 0
	const active = data?.active ?? 0
	const inactive = data?.inactive ?? 0

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col'>
			<div className='flex items-center justify-between mb-3 gap-2'>
				<div>
					<h3 className='text-lg font-semibold text-blue-600'>
						Активные / пассивные группы
					</h3>
					<p className='text-xs text-gray-500'>
						Активность по группам за период
					</p>
				</div>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			{isLoading ? (
				<SkeletonWidget type='card' />
			) : (
				<div className='grid grid-cols-3 gap-3'>
					<div className='rounded-md border p-3'>
						<div className='text-xs text-muted-foreground'>Всего</div>
						<div className='text-xl font-semibold'>{total}</div>
					</div>

					<div className='rounded-md border p-3'>
						<div className='text-xs text-muted-foreground'>Активные</div>
						<div className='text-xl font-semibold text-green-600'>{active}</div>
					</div>

					<div className='rounded-md border p-3'>
						<div className='text-xs text-muted-foreground'>Пассивные</div>
						<div className='text-xl font-semibold text-orange-600'>
							{inactive}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
