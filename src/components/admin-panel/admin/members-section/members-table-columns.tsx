import { ColumnDef } from '@tanstack/react-table'
import { Shield, ShieldBan, Trash2 } from 'lucide-react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { Button } from '@/components/ui/button/Button'

export const membersColumns: ColumnDef<any>[] = [
	{
		accessorKey: 'name',
		header: 'Пользователь',
		enableSorting: true,
		cell: ({ row }) => (
			<div className='flex items-center gap-2'>
				<UserAvatar
					src={row.original.avatar}
					name={row.original.name}
					email={row.original.email}
					size={36}
				/>
				<span>{row.original.name}</span>
			</div>
		)
	},
	{ accessorKey: 'email', header: 'Email', enableSorting: true },
	{
		accessorKey: 'status',
		header: 'Статус',
		enableSorting: true,
		cell: ({ row }) => (
			<span
				className={
					row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
				}
			>
				{row.original.status === 'active' ? 'Активен' : 'Заблокирован'}
			</span>
		)
	},
	{
		accessorKey: 'joinedAt',
		header: 'Дата вступления',
		enableSorting: true,
		cell: ({ row }) => row.original.joinedAtFormatted
	},
	{
		id: 'actions',
		header: 'Действия',
		enableSorting: false,
		cell: ({ row }) => {
			const member = row.original
			if (member.role === 'admin') return null
			if (member.id === member.currentUserId) return null

			return (
				<div className='flex gap-2'>
					{member.status === 'active' ? (
						<Button
							size='icon'
							variant='outline'
							Icon={ShieldBan}
							title='Заблокировать'
							onClick={() => member.onBlock(member.id)}
						/>
					) : (
						<Button
							size='icon'
							variant='outline'
							Icon={Shield}
							title='Разблокировать'
							onClick={() => member.onUnblock(member.id)}
						/>
					)}

					<Button
						size='icon'
						variant='destructive'
						Icon={Trash2}
						title='Удалить'
						onClick={() => member.onRemove(member.id)}
					/>
				</div>
			)
		}
	}
]
