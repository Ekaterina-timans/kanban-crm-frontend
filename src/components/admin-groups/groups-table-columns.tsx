import { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button/Button'

import { IAdminGroup } from '@/types/admin-group.types'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import { cn } from '@/lib/utils'

type GroupsColumnsDeps = {
	deleteMutation: {
		mutate: (id: number) => void
		isPending: boolean
		variables?: number
	}
}

export function getGroupsColumns({
	deleteMutation
}: GroupsColumnsDeps): ColumnDef<IAdminGroup>[] {
	return [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => <span className='font-medium'>{row.original.id}</span>
		},
		{
			accessorKey: 'name',
			header: 'Название',
			cell: ({ row }) => (
				<span className='font-medium'>{row.original.name}</span>
			)
		},
		{
			accessorKey: 'users_count',
			header: 'Участники',
			cell: ({ row }) => <span>{row.original.users_count}</span>
		},
		{
			accessorKey: 'spaces_count',
			header: 'Пространства',
			cell: ({ row }) => <span>{row.original.spaces_count}</span>
		},
		{
			accessorKey: 'activity_score',
			header: 'Активность',
			cell: ({ row }) => (
				<span className='text-gray-600'>
					{row.original.activity_score ?? '—'}
				</span>
			)
		},
		{
			id: 'actions',
			header: () => <div className='text-right'>Действия</div>,
			cell: ({ row }) => {
				const g = row.original
				const isDeleting =
					deleteMutation.isPending && deleteMutation.variables === g.id

				return (
					<div className='flex justify-end gap-2'>
						<Link
							href={`${ADMIN_PAGES.GROUPS}/${g.id}`}
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
								const ok = confirm(`Удалить группу #${g.id}?`)
								if (ok) deleteMutation.mutate(g.id)
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
