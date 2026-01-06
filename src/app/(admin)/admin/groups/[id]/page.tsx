'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { getGroupUsersColumns } from '@/components/admin-groups/group-users-table-columns'
import Badge from '@/components/ui/badge/Badge'
import { buttonVariants } from '@/components/ui/button/Button'
import { DataTable } from '@/components/ui/table/DataTable'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import { useAdminGroup } from '@/hooks/admin/useAdminGroups'

import { formatDate } from '@/utils/date-utils'

import { cn } from '@/lib/utils'

export default function AdminGroupDetailsPage() {
	const params = useParams()
	const searchParams = useSearchParams()

	const rawId = params?.id
	const id = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId)

	if (!id || Number.isNaN(id)) {
		return (
			<div className='text-sm text-muted-foreground'>
				Некорректный ID группы
			</div>
		)
	}

	const from = searchParams.get('from')
	const userIdRaw = searchParams.get('userId')
	const userId = userIdRaw ? Number(userIdRaw) : null

	const backHref =
		from === 'user' && userId && !Number.isNaN(userId)
			? `${ADMIN_PAGES.USERS}/${userId}`
			: ADMIN_PAGES.GROUPS

	const { data, isLoading } = useAdminGroup(id)

	const group = data?.group
	const members = data?.members ?? []
	const spaces = data?.spaces ?? []
	const activity14 = data?.activity_last_14_days

	const columns = useMemo(() => getGroupUsersColumns(), [])

	if (isLoading) {
		return <div className='text-sm text-muted-foreground'>Загрузка...</div>
	}

	if (!group) {
		return (
			<div className='text-sm text-muted-foreground'>Группа не найдена</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex gap-5 items-center'>
					<h1 className='text-2xl font-semibold'>{group.name}</h1>
					<span className='text-xl'>ID: {group.id}</span>
				</div>

				<Link
					href={backHref}
					className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
				>
					Назад
				</Link>
			</div>

			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<div className='flex flex-wrap items-center gap-2'>
					<Badge
						text={group.computed_status}
						color={group.computed_status === 'active' ? 'success' : 'warning'}
						size='small'
					/>

					<span className='text-sm text-muted-foreground'>
						Создана:{' '}
						<span className='font-medium text-gray-900'>
							{formatDate(new Date(group.created_at))}
						</span>
					</span>

					<span className='text-muted-foreground'>•</span>

					<span className='text-sm text-muted-foreground'>
						Участники:{' '}
						<span className='font-medium text-gray-900'>
							{group.members_count}
						</span>
					</span>

					<span className='text-muted-foreground'>•</span>

					<span className='text-sm text-muted-foreground'>
						Проекты:{' '}
						<span className='font-medium text-gray-900'>
							{group.spaces_count}
						</span>
					</span>

					<span className='text-muted-foreground'>•</span>

					<span className='text-sm text-muted-foreground'>
						Активность 14д:{' '}
						<span className='font-medium text-gray-900'>
							{typeof activity14 === 'number' ? activity14 : '—'}
						</span>
					</span>
				</div>

				<div className='mt-3 text-sm text-muted-foreground'>
					Создатель:{' '}
					<span className='font-medium text-gray-900'>
						{group.creator?.name ?? '—'}
					</span>
					<span className='text-muted-foreground'>
						{' '}
						• {group.creator?.email ?? '—'}
					</span>
				</div>
			</div>

			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>Участники</h2>
					<span className='text-sm text-muted-foreground'>
						Всего: {members.length}
					</span>
				</div>

				<DataTable
					columns={columns}
					data={members}
					isLoading={false}
				/>
			</div>

			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>Проекты</h2>
					<span className='text-sm text-muted-foreground'>
						Всего: {spaces.length}
					</span>
				</div>

				{spaces.length === 0 ? (
					<p className='text-sm text-muted-foreground'>Spaces нет</p>
				) : (
					<div className='space-y-2'>
						{spaces.map(s => (
							<div
								key={s.id}
								className='flex items-center justify-between rounded-lg border px-4 py-3'
							>
								<span className='font-medium'>{s.name}</span>
								<span className='text-sm text-muted-foreground'>
									ID: {s.id}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
