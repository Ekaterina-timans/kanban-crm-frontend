import { Edit, MoreVertical, Trash2 } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'
import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'
import { Permission } from '@/types/permission.enum'

export function SpaceContextMenu({
	onEdit,
	onDelete
}: {
	onEdit: () => void
	onDelete: () => void
}) {
	const canEditSpace = useSpaceAccessStore.getState().can(Permission.SPACE_EDIT)
	const canDeleteSpace = useSpaceAccessStore.getState().can(Permission.SPACE_DELETE)

	// Если нет прав ни на редактирование, ни на удаление — не показываем троеточие
	if (!canEditSpace && !canDeleteSpace) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					onClick={e => e.stopPropagation()}
					className='text-slate-500 hover:text-slate-700 p-1 rounded'
				>
					<MoreVertical className='w-4 h-4' />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='w-44 z-50'
			>
				{canEditSpace && (
					<DropdownMenuItem
						onSelect={() => queueMicrotask(onEdit)}
						className='cursor-pointer'
					>
						<Edit className='mr-2 h-4 w-4' />
						Редактировать
					</DropdownMenuItem>
				)}

				{canDeleteSpace && (
					<DropdownMenuItem
						onSelect={onDelete}
						className='cursor-pointer text-red-600 focus:text-red-700'
					>
						<Trash2 className='mr-2 h-4 w-4' />
						Удалить
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
