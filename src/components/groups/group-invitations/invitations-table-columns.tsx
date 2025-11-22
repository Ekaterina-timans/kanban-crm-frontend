import { ColumnDef } from '@tanstack/react-table'

import { IGroupInvitation } from '@/types/group-invititations.types'

import { formatDateForCard } from '@/utils/date-utils'

export const invitationColumns: ColumnDef<IGroupInvitation>[] = [
	{
		accessorKey: 'email',
		header: 'Почта',
		enableSorting: true
	},
	{
		accessorKey: 'created_at',
		header: 'Отправлено',
		enableSorting: true,
		cell: ({ getValue }) => formatDateForCard(getValue() as string)
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		enableSorting: true,
		cell: ({ getValue }) => {
			const status = getValue() as string
			switch (status) {
				case 'pending':
					return <span className='text-blue-600'>В ожидании</span>
				case 'accepted':
					return <span className='text-green-600'>Принято</span>
				case 'expired':
					return <span className='text-yellow-600'>Истекло</span>
				case 'declined':
					return <span className='text-red-600'>Отказано</span>
				default:
					return status
			}
		}
	}
]
