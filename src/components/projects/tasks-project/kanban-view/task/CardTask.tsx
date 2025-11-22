import { CalendarDays, UserCircle2 } from 'lucide-react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { ITask } from '@/types/task.types'

import {
	priorities,
	priorityIcons,
	statusIcons,
	statuses
} from '@/config/data.config'

import { formatDateForCard } from '@/utils/date-utils'
import { getBadgeColorPriority, getBadgeColorStatus } from '@/utils/getColor'

import { TaskContextMenu } from './TaskContextMenu'

export function CardTask({
	onOpen,
	onDelete,
	task
}: {
	task: ITask
	onOpen: () => void
	onDelete: () => void
}) {
	return (
		<div className='h-[210px] rounded-2xl mb-5 p-3 flex flex-col bg-white shadow-md hover:shadow-lg transition select-none'>
			<div className='flex items-start justify-between mb-1'>
				<div className='flex-1 min-w-0'>
					<Tooltip text={task.name}>
						<h4 className='text-[17px] font-semibold text-gray-800 truncate'>
							{task.name}
						</h4>
					</Tooltip>
				</div>
				<TaskContextMenu
					onOpen={onOpen}
					onDelete={onDelete}
				/>
			</div>
			{task.description && (
				<p className='text-sm text-gray-500 mb-3 line-clamp-2'>
					{task.description}
				</p>
			)}
			<div className='flex items-center gap-2 flex-wrap mb-3'>
				<Badge
					text={
						<span className='flex items-center'>
							{statusIcons[task.status_id]}
							{statuses[task.status_id]}
						</span>
					}
					color={getBadgeColorStatus(task.status_id)}
					className='rounded-full text-xs shadow-sm'
				/>
				<Badge
					text={
						<span className='flex items-center'>
							{priorityIcons[task.priority_id]}
							{priorities[task.priority_id]}
						</span>
					}
					color={getBadgeColorPriority(task.priority_id)}
					className='rounded-full text-xs shadow-sm'
				/>
			</div>
			<div className='mt-auto flex items-center justify-between text-gray-500 text-sm'>
				{task.assignee && (
					<div className='relative group flex items-center'>
						<UserAvatar
							src={task.assignee.avatar}
							name={task.assignee.name ?? null}
							email={task.assignee.email}
							size={28}
							className='border border-gray-200 shadow-sm'
						/>

						{/* Всплывающая подсказка */}
						<span className='absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none'>
							{task.assignee.name || task.assignee.email}
						</span>
					</div>
				)}

				{task.due_date && (
					<div className='flex items-center gap-1 text-gray-500'>
						<CalendarDays className='w-4 h-4' />
						{formatDateForCard(task.due_date)}
					</div>
				)}
			</div>
		</div>
	)
}
