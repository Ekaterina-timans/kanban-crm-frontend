import { ColumnDef } from '@tanstack/react-table'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'

import { IGroupMember } from '@/types/admin-group.types'

export function getGroupUsersColumns(): ColumnDef<IGroupMember>[] {
	return [
		{
			id: 'user',
			header: 'Пользователь',
			cell: ({ row }) => {
				const u = row.original

				return (
					<div className='flex items-center gap-3'>
						<UserAvatar
							src={u.avatar ?? null}
							name={u.name ?? null}
							email={u.email}
							size={36}
						/>

						<div className='leading-tight'>
							<div className='font-medium'>{u.name || 'Без имени'}</div>
							<div className='text-xs text-muted-foreground'>{u.email}</div>
						</div>
					</div>
				)
			}
		},
		{
			accessorKey: 'role',
			header: 'Роль',
			cell: ({ row }) => (
				<Badge
					text={row.original.role}
					color={row.original.role === 'admin' ? 'primary' : 'default'}
					size='small'
				/>
			)
		},
		{
			accessorKey: 'status',
			header: 'Статус в группе',
			cell: ({ row }) => {
				const s = row.original.status ?? 'active'
				return (
					<Badge
						text={s}
						color={s === 'blocked' ? 'danger' : 'success'}
						size='small'
					/>
				)
			}
		}
	]
}
