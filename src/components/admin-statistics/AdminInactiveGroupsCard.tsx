'use client'

import Link from 'next/link'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button/Button'
import { PeriodSelect } from '@/components/ui/period-select/PeriodSelect'
import { PeriodParams } from '@/components/ui/period-select/period'
import { SkeletonWidget } from '@/components/ui/skeleton/SkeletonWidget'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import { useAdminInactiveGroups } from '@/hooks/admin/useAdminStatistics'

import { cn } from '@/lib/utils'

export function AdminInactiveGroupsCard() {
	const [period, setPeriod] = useState<PeriodParams>({ period: 'month' })

	const { data, isLoading } = useAdminInactiveGroups(period)

	const groups = data?.groups ?? []

	return (
		<div className='bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col lg:col-span-2'>
			<div className='flex items-center justify-between mb-3 gap-2'>
				<div>
					<h3 className='text-lg font-semibold text-blue-600'>
						Список пассивных групп
					</h3>
					<p className='text-xs text-gray-500'>
						Группы без активности в периоде
					</p>
				</div>

				<PeriodSelect
					value={period}
					onChange={setPeriod}
				/>
			</div>

			{isLoading ? (
				<SkeletonWidget type='card' />
			) : groups.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
					Нет пассивных групп за выбранный период
				</div>
			) : (
				<div className='space-y-2'>
					{groups.map(g => (
						<div
							key={g.id}
							className='flex items-center justify-between rounded-md border px-3 py-2'
						>
							<div className='min-w-0'>
								<div className='font-medium truncate'>
									#{g.id} — {g.name}
								</div>

								<div className='text-xs text-muted-foreground'>
									Создатель: {g.creator?.name ?? '—'} •{' '}
									{g.creator?.email ?? '—'}
								</div>
							</div>

							<Link
								href={`${ADMIN_PAGES.GROUPS}/${g.id}`}
								className={cn(
									buttonVariants({ variant: 'outline', size: 'sm' })
								)}
							>
								Открыть
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
