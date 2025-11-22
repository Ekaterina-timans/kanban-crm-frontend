import { Edit, MoreVertical, Trash2 } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { Permission } from '@/types/permission.enum'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

export function HeaderColumn({
	name,
	color,
	count,
	onEdit,
	onDelete
}: {
	name: string
	color: string
	count: number
	onEdit: () => void
	onDelete: () => void
}) {
	const canEditColumn = useSpaceAccessStore
		.getState()
		.can(Permission.COLUMN_EDIT)
	const canDeleteColumn = useSpaceAccessStore
		.getState()
		.can(Permission.COLUMN_DELETE)

	return (
		<div
			className='w-72 h-12 rounded-xl flex items-center justify-between px-3 relative group transition-colors'
			style={{ backgroundColor: color }}
		>
			{/* Название колонки */}
			<div className='flex-1 min-w-0 mr-2'>
				<Tooltip text={name} offset={20}>
					<span className='block text-white text-[19px] font-medium truncate whitespace-nowrap overflow-hidden'>
						{name}
					</span>
				</Tooltip>
			</div>

			{/* Правая часть: счётчик и меню */}
			<div className='flex items-center gap-2'>
				<div className='inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/30 px-2 text-white text-sm font-semibold'>
					{count}
				</div>

				{/* Меню с троеточием */}
				{(canEditColumn || canDeleteColumn) && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type='button'
								className='text-white/80 hover:text-white transition-opacity'
								onClick={e => e.stopPropagation()}
							>
								<MoreVertical className='w-5 h-5' />
							</button>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align='end'
							className='w-44 z-50'
						>
							{canEditColumn && (
								<DropdownMenuItem
									onSelect={() => queueMicrotask(onEdit)}
									className='cursor-pointer'
								>
									<Edit className='mr-2 h-4 w-4' />
									Редактировать
								</DropdownMenuItem>
							)}

							{canDeleteColumn && (
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
				)}
			</div>
		</div>
	)
}
