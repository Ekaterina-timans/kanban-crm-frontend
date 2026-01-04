'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import {
	GroupRow,
	userGroupsColumns
} from '@/components/admin-users/user-groups-table-columns'
import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import { Button, buttonVariants } from '@/components/ui/button/Button'
import { DataTable } from '@/components/ui/table/DataTable'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import {
	useAdminUser,
	useBlockAdminUser,
	useDeleteAdminUser,
	useUnblockAdminUser
} from '@/hooks/admin/useAdminUsers'

import { cn } from '@/lib/utils'

export default function AdminUserDetailsPage() {
	const params = useParams()
	const router = useRouter()

	const rawId = params?.id
	const id = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId)

	if (!id || Number.isNaN(id)) {
		return <div className='text-sm text-muted-foreground'>Некорректный ID</div>
	}

	const { data, isLoading, isError } = useAdminUser(id)

	const blockMutation = useBlockAdminUser()
	const unblockMutation = useUnblockAdminUser()
	const deleteMutation = useDeleteAdminUser()

	if (isLoading) {
		return <div className='text-sm text-muted-foreground'>Загрузка...</div>
	}

	if (isError) {
		return (
			<div className='text-sm text-muted-foreground'>
				Ошибка загрузки confirm
			</div>
		)
	}

	const user = data?.user
	const groups: GroupRow[] = (data?.groups as GroupRow[]) ?? []

	if (!user) {
		return (
			<div className='text-sm text-muted-foreground'>
				Пользователь не найден
			</div>
		)
	}

	const isBlocked = user.account_status === 'blocked'

	return (
		<div className='space-y-6'>
			{/* Top bar */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-semibold'>Пользователь ID: {user.id}</h1>
				</div>

				<Link
					href={ADMIN_PAGES.USERS}
					className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
				>
					Назад
				</Link>
			</div>

			{/* User Card */}
			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<div className='flex items-start justify-between gap-6'>
					{/* Left */}
					<div className='flex items-center gap-4'>
						<UserAvatar
							src={user.avatar}
							name={user.name}
							email={user.email}
							size={56}
							className='border border-slate-300'
						/>

						<div>
							<p className='text-lg font-semibold leading-tight'>
								{user.name || 'Без имени'}
							</p>
							<p className='text-sm text-muted-foreground'>{user.email}</p>

							<div className='mt-2 flex flex-wrap gap-2'>
								<Badge
									text={isBlocked ? 'blocked' : 'active'}
									color={isBlocked ? 'danger' : 'success'}
									size='small'
								/>

								<Badge
									text={user.access_level ?? 'user'}
									color={user.access_level === 'admin' ? 'primary' : 'default'}
									size='small'
								/>
							</div>
						</div>
					</div>

					{/* Right */}
					<div className='flex flex-col items-end gap-3'>
						<div className='text-sm text-muted-foreground'>
							Создан: {new Date(user.created_at).toLocaleString()}
						</div>

						<div className='flex gap-2'>
							{isBlocked ? (
								<Button
									variant='secondary'
									size='sm'
									onClick={() => unblockMutation.mutate(user.id)}
									disabled={unblockMutation.isPending}
								>
									Разблокировать
								</Button>
							) : (
								<Button
									variant='secondary'
									size='sm'
									onClick={() => blockMutation.mutate(user.id)}
									disabled={blockMutation.isPending}
								>
									Заблокировать
								</Button>
							)}

							<Button
								variant='destructive'
								size='sm'
								onClick={() => {
									const ok = confirm(`Удалить пользователя #${user.id}?`)
									if (!ok) return

									deleteMutation.mutate(user.id, {
										onSuccess: () => router.replace(ADMIN_PAGES.USERS)
									})
								}}
								disabled={deleteMutation.isPending}
							>
								Удалить
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Groups Table */}
			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<h2 className='text-lg font-semibold'>Группы пользователя</h2>

				<DataTable
					columns={userGroupsColumns}
					data={groups}
					isLoading={false}
				/>
			</div>
		</div>
	)
}
