import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { ITask } from '@/types/task.types'

import { CardTask } from './CardTask'

export function SortableCardTask({
	task,
	columnId,
	renderTask,
	onOpenTask,
	onDeleteTask
}: {
	task: ITask
	columnId: string
	renderTask: (task: ITask) => React.ReactNode
	onOpenTask: (taskId: string) => void
	onDeleteTask: (taskId: string) => void
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: task.id,
			data: { type: 'task', columnId }
		})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: 10
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className='mt-1 touch-pan-y'
			onDoubleClick={e => {
				e.stopPropagation()
				onOpenTask(task.id)
			}}
		>
			<CardTask
				task={task}
				onOpen={() => onOpenTask(task.id)}
				onDelete={() => onDeleteTask(task.id)}
			/>
		</div>
	)
}
