import { ColumnDef } from '@tanstack/react-table'

import { IGroup } from '@/types/group.types'
import { formatDateForCard } from '@/utils/date-utils'

export const groupColumns = (
	currentGroupId: string | null | undefined,
	onChangeGroup: (groupId: string) => void
): ColumnDef<IGroup & { joined_at?: string }>[] => [
	{
		accessorKey: 'name',
		header: 'Наименование группы',
		enableSorting: true
	},
	{
		accessorKey: 'description',
		header: 'Описание',
		enableSorting: false,
		cell: ({ getValue }) => {
			const value = getValue() as string | undefined
			if (!value) {
				return <span className='text-muted-foreground'>Нет описания</span>
			}
			return value
		}
	},
	{
		accessorKey: 'role',
		header: 'Ваша роль',
		enableSorting: true,
		cell: ({ getValue }) => (getValue() === 'admin' ? 'Админ' : 'Участник')
	},
	{
		accessorKey: 'joined_at',
		header: 'Дата вступления',
		enableSorting: true,
		cell: ({ row }) => {
			const pivotCreated = row.original.pivot?.created_at
			return pivotCreated ? (
				formatDateForCard(pivotCreated)
			) : (
				<span className='text-muted-foreground'>—</span>
			)
		}
	},
	{
		id: 'go',
		header: 'Перейти в группу',
		cell: ({ row }) => {
			const groupId = String(row.original.id)
			const isCurrent = groupId === currentGroupId
			return (
				<button
					disabled={isCurrent}
					onClick={() => !isCurrent && onChangeGroup(groupId)}
					className={`px-3 py-1 rounded ${
						isCurrent
							? 'bg-gray-200 text-gray-400 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
				>
					{isCurrent ? 'Вы здесь' : 'Перейти'}
				</button>
			)
		}
	}
]
