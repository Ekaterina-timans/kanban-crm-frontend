import { CalendarDays, ListChecks } from 'lucide-react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'

import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import {
	priorities,
	priorityIcons,
	statusIcons,
	statuses
} from '@/constants/task-ui'

import { ITask } from '@/types/task.types'

import { formatDateForCard } from '@/utils/date-utils'
import { getBadgeColorPriority, getBadgeColorStatus } from '@/utils/getColor'

import { TaskContextMenu } from './TaskContextMenu'
import { Progress } from '@/components/ui/progress/progress'

export function CardTask({
	onOpen,
	onDelete,
	task
}: {
	task: ITask
	onOpen: () => void
	onDelete: () => void
}) {
	const lists = task.checklists_count ?? 0
	const total = task.checklist_items_total ?? 0
	const done = task.checklist_items_done ?? 0

	const showChecklist = lists > 0 && total > 0
	const percent = showChecklist ? Math.round((done / total) * 100) : 0
	const progressVariant =
		showChecklist && done === total ? 'success' : 'default'

	return (
		<div className='h-[190px] rounded-2xl mb-5 p-3 flex flex-col bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition select-none'>
			<div className='flex items-start justify-between mb-1'>
				<div className='flex-1 min-w-0'>
					<Tooltip text={task.name}>
						<h4 className='text-[17px] font-semibold text-foreground truncate'>
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
				<p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
					{task.description}
				</p>
			)}

			<div className='flex items-center gap-2 flex-wrap mb-3'>
				<Badge
					text={
						<span className='flex items-center gap-1'>
							{statusIcons[task.status_id]}
							{statuses[task.status_id]}
						</span>
					}
					color={getBadgeColorStatus(task.status_id)}
					className='rounded-full text-xs shadow-sm'
				/>
				<Badge
					text={
						<span className='flex items-center gap-1'>
							{priorityIcons[task.priority_id]}
							{priorities[task.priority_id]}
						</span>
					}
					color={getBadgeColorPriority(task.priority_id)}
					className='rounded-full text-xs shadow-sm'
				/>
			</div>

			{showChecklist && (
				<div className='mb-3 mt-2 flex items-center gap-2'>
					<div className='flex items-center gap-1 text-xs text-muted-foreground shrink-0'>
						<ListChecks className='h-4 w-4' />
						<span>
							{done}/{total}
						</span>
						{lists > 1 && <span className='opacity-70'>· {lists} списка</span>}
					</div>

					<div className='min-w-0 flex-1'>
						<Progress
							value={percent}
							variant={progressVariant}
							className='h-2'
						/>
					</div>
				</div>
			)}

			<div className='mt-auto flex items-center justify-between text-muted-foreground text-sm'>
				{task.assignee ? (
					<div className='relative group flex items-center'>
						<UserAvatar
							src={task.assignee.avatar}
							name={task.assignee.name ?? null}
							email={task.assignee.email}
							size={28}
							className='border border-border shadow-sm'
						/>

						<span className='absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-popover text-popover-foreground border border-border px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-sm'>
							{task.assignee.name || task.assignee.email}
						</span>
					</div>
				) : (
					<div />
				)}

				{task.due_date && (
					<div className='flex items-center gap-1 text-muted-foreground'>
						<CalendarDays className='w-4 h-4' />
						{formatDateForCard(task.due_date)}
					</div>
				)}
			</div>
		</div>
	)
}
