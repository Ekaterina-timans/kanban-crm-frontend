import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { ADMIN_PAGES } from '@/config/admin-pages.config'

import Badge from '../ui/badge/Badge'

import { GroupBlockButton } from './GroupBlockButton'

export type GroupRow = {
	group_id: number
	group_name: string
	role: string
	status: 'active' | 'blocked' | null
	_userId?: number
}

export const userGroupsColumns: ColumnDef<GroupRow>[] = [
	{
		accessorKey: 'group_name',
		header: 'Группа',
		cell: ({ row }) => {
			const g = row.original
			const userId = g._userId

			return (
				<Link
					href={`${ADMIN_PAGES.GROUPS}/${g.group_id}?from=user&userId=${userId}`}
					className='text-primary underline underline-offset-2'
				>
					{g.group_name}
				</Link>
			)
		}
	},
	{
		accessorKey: 'role',
		header: 'Роль',
		cell: ({ row }) => <span className='capitalize'>{row.original.role}</span>
	},
	{
		accessorKey: 'status',
		header: 'Статус в группе',
		cell: ({ row }) => {
			const status = row.original.status

			if (!status) {
				return (
					<Badge
						text='—'
						color='default'
						size='small'
					/>
				)
			}

			return (
				<Badge
					text={status === 'blocked' ? 'blocked' : 'active'}
					color={status === 'blocked' ? 'danger' : 'success'}
					size='small'
				/>
			)
		}
	},
	{
		id: 'actions',
		header: 'Действия',
		cell: ({ row }) => {
			const g = row.original

			if (!g._userId) return <span className='text-muted-foreground'>—</span>

			return (
				<GroupBlockButton
					userId={g._userId}
					groupId={g.group_id}
					status={g.status}
				/>
			)
		}
	}
]
