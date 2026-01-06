import { ColumnDef } from '@tanstack/react-table'
import { Ban, CheckCircle2, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button/Button'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import { cn } from '@/lib/utils'
import { formatDateForCard } from '@/utils/date-utils'

export type UserRow = {
	id: number
	email: string
	name?: string | null
	account_status: 'active' | 'blocked'
	created_at: string
	access_level?: 'admin' | 'user'
}

type UsersColumnsDeps = {
	blockMutation: {
		mutate: (id: number) => void
		isPending: boolean
		variables?: number
	}
	unblockMutation: {
		mutate: (id: number) => void
		isPending: boolean
		variables?: number
	}
	deleteMutation: {
		mutate: (id: number) => void
		isPending: boolean
		variables?: number
	}
}

export function getUsersColumns({
	blockMutation,
	unblockMutation,
	deleteMutation
}: UsersColumnsDeps): ColumnDef<UserRow>[] {
	return [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => <span className='font-medium'>{row.original.id}</span>
		},
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'name',
			header: 'Имя',
			cell: ({ row }) => row.original.name || '—'
		},
		{
			accessorKey: 'account_status',
			header: 'Статус',
			cell: ({ row }) => {
				const u = row.original
				const isBlocked = u.account_status === 'blocked'

				const isBlocking =
					blockMutation.isPending && blockMutation.variables === u.id
				const isUnblocking =
					unblockMutation.isPending && unblockMutation.variables === u.id

				return isBlocked ? (
					<Button
						variant='secondary'
						size='sm'
						Icon={CheckCircle2}
						iconClassName='h-4 w-4'
						onClick={() => unblockMutation.mutate(u.id)}
						disabled={isUnblocking}
					>
						Разблокировать
					</Button>
				) : (
					<Button
						variant='secondary'
						size='sm'
						Icon={Ban}
						iconClassName='h-4 w-4'
						onClick={() => blockMutation.mutate(u.id)}
						disabled={isBlocking}
					>
						Заблокировать
					</Button>
				)
			}
		},
		{
			accessorKey: 'created_at',
			header: 'Создан',
			cell: ({ row }) => {
				const date = row.original.created_at
				return (
					<span className='text-gray-600'>
						{date ? formatDateForCard(date) : '—'}
					</span>
				)
			}
		},
		{
			id: 'actions',
			header: () => <div className='text-right'>Действия</div>,
			cell: ({ row }) => {
				const u = row.original

				const isDeleting =
					deleteMutation.isPending && deleteMutation.variables === u.id

				return (
					<div className='flex justify-end gap-2'>
						<Link
							href={`${ADMIN_PAGES.USERS}/${u.id}`}
							className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
						>
							Открыть
						</Link>

						<Button
							variant='destructive'
							size='sm'
							Icon={Trash2}
							iconClassName='h-4 w-4'
							onClick={() => {
								const ok = confirm(`Удалить пользователя #${u.id}?`)
								if (ok) deleteMutation.mutate(u.id)
							}}
							disabled={isDeleting}
						>
							Удалить
						</Button>
					</div>
				)
			}
		}
	]
}
