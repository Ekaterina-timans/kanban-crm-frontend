import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown/dropdown-menu"
import { useSpaceAccessStore } from "@/store/useSpaceAccessStore"
import { Permission } from "@/types/permission.enum"
import { Eye, MoreVertical, Trash2 } from "lucide-react"

interface TaskContextMenuProps {
	onOpen: () => void
	onDelete: () => void
}

export function TaskContextMenu({ onOpen, onDelete }: TaskContextMenuProps) {
	const canReadTask = useSpaceAccessStore.getState().can(Permission.TASK_READ)
	const canDeleteTask = useSpaceAccessStore.getState().can(Permission.TASK_DELETE)

	if (!canReadTask && !canDeleteTask) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					onClick={e => e.stopPropagation()}
					className='text-gray-500 hover:text-gray-700 p-1 rounded transition'
				>
					<MoreVertical className='w-5 h-5' />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' className='w-40 z-50'>
				{canReadTask && (
					<DropdownMenuItem
						onSelect={() => queueMicrotask(onOpen)}
						className='cursor-pointer'
					>
						<Eye className='mr-2 h-4 w-4' />
						Открыть
					</DropdownMenuItem>
				)}

				{canDeleteTask && (
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
