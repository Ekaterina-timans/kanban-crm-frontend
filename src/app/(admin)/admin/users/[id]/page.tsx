'use client'

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
	useDemoteAdminUser,
	usePromoteAdminUser,
	useUnblockAdminUser
} from '@/hooks/admin/useAdminUsers'

import { formatDate } from '@/utils/date-utils'

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
	const promoteMutation = usePromoteAdminUser()
	const demoteMutation = useDemoteAdminUser()

	if (isLoading) {
		return <div className='text-sm text-muted-foreground'>Загрузка...</div>
	}

	if (isError) {
		return <div className='text-sm text-muted-foreground'>Ошибка загрузки</div>
	}

	const user = data?.user

	if (!user) {
		return (
			<div className='text-sm text-muted-foreground'>
				Пользователь не найден
			</div>
		)
	}

	const groups: GroupRow[] = ((data?.groups as GroupRow[]) ?? []).map(g => ({
		...g,
		_userId: user.id
	}))

	const isBlocked = user.account_status === 'blocked'
	const isAdmin = user.access_level === 'admin'

	const isAnyActionPending =
		blockMutation.isPending ||
		unblockMutation.isPending ||
		deleteMutation.isPending ||
		promoteMutation.isPending ||
		demoteMutation.isPending

	return (
		<div className='space-y-6'>
			{/* Top bar */}
			<div className='flex items-center justify-between'>
				<div className='flex gap-5 items-center'>
					<h1 className='text-2xl font-semibold'>Пользователь</h1>
					<span className='text-xl'>ID: {user.id}</span>
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
							src={user.avatar ?? null}
							name={user.name ?? null}
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
							Создан: {formatDate(new Date(user.created_at))}
						</div>

						<div className='flex gap-2 flex-wrap justify-end'>
							{/* Глобальная блокировка */}
							{isBlocked ? (
								<Button
									variant='secondary'
									size='sm'
									onClick={() => unblockMutation.mutate(user.id)}
									disabled={isAnyActionPending}
								>
									Разблокировать
								</Button>
							) : (
								<Button
									variant='secondary'
									size='sm'
									onClick={() => blockMutation.mutate(user.id)}
									disabled={isAnyActionPending}
								>
									Заблокировать
								</Button>
							)}

							{/* Назначить / снять админа приложения */}
							{isAdmin ? (
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										const ok = confirm(
											`Снять права администратора у пользователя #${user.id}?`
										)
										if (!ok) return
										demoteMutation.mutate(user.id)
									}}
									disabled={isAnyActionPending}
								>
									Снять админа
								</Button>
							) : (
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										const ok = confirm(
											`Назначить пользователя #${user.id} администратором приложения?`
										)
										if (!ok) return
										promoteMutation.mutate(user.id)
									}}
									disabled={isAnyActionPending}
								>
									Сделать админом
								</Button>
							)}

							{/* Удаление */}
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
								disabled={isAnyActionPending}
							>
								Удалить
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Groups Table */}
			<div className='rounded-xl border bg-white p-6 shadow-sm'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>Группы пользователя</h2>
					<span className='text-sm text-muted-foreground'>
						Всего: {groups.length}
					</span>
				</div>

				<DataTable
					columns={userGroupsColumns}
					data={groups}
					isLoading={false}
				/>
			</div>
		</div>
	)
}
