'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { IColumnTask } from '@/types/column.types'
import { Permission } from '@/types/permission.enum'
import { ITask } from '@/types/task.types'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useDeleteColumn } from '@/hooks/column/useDeleteColumn'
import { useDeleteTask } from '@/hooks/task/useDeleteTask'

import { SortableCardTask } from '../task/SortableCardTask'
import { TaskModal } from '../task/TaskModal'
import { TaskModalView } from '../task/task-id/TaskModalView'

import { HeaderColumn } from './HeaderColumn'

export function Column({
	column,
	onEdit,
	renderTask
}: {
	column: IColumnTask
	onEdit: () => void
	renderTask: (task: ITask) => React.ReactNode
}) {
	const [isCreateModalOpen, setCreateModalOpen] = useState(false)
	const [isViewModalOpen, setViewModalOpen] = useState(false)
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
	const { deleteColumn } = useDeleteColumn()
	const { deleteTask } = useDeleteTask()

	const { setNodeRef } = useDroppable({
		id: column.id,
		data: {
			type: 'column',
			columnId: column.id
		}
	})

	const handleDelete = () => {
		if (
			window.confirm(
				`Удалить колонку "${column.name}"? Это действие нельзя отменить.`
			)
		) {
			deleteColumn(column.id)
		}
	}

	const handleOpenTask = (taskId: string) => {
		setSelectedTaskId(taskId)
		setViewModalOpen(true)
	}

	const handleDeleteTask = (taskId: string) => {
		if (confirm('Удалить эту задачу?')) {
			deleteTask(taskId)
		}
	}

	const canCreateTask = useSpaceAccessStore
		.getState()
		.can(Permission.TASK_CREATE)

	return (
		<div
			ref={setNodeRef}
			className='w-72 flex flex-col'
		>
			<div className='flex flex-col justify-center items-center'>
				<HeaderColumn
					name={column.name}
					color={column.color}
					count={column.tasks_count}
					onEdit={onEdit}
					onDelete={handleDelete}
				/>
				{canCreateTask && (
					<div
						onClick={() => setCreateModalOpen(true)}
						className='mx-auto mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white hover:bg-slate-100 transition-colors cursor-pointer'
					>
						<Tooltip text='Создать задачу'>
							<Plus className='h-5 w-5' />
						</Tooltip>
					</div>
				)}
			</div>
			<SortableContext
				items={column.tasks.map(task => task.id)}
				strategy={verticalListSortingStrategy}
			>
				{column.tasks && column.tasks.length > 0 ? (
					column.tasks.map(task => (
						<SortableCardTask
							key={task.id}
							task={task}
							columnId={column.id}
							renderTask={renderTask}
							onOpenTask={handleOpenTask}
							onDeleteTask={handleDeleteTask}
						/>
					))
				) : (
					<div></div>
				)}
			</SortableContext>
			<TaskModal
				spaceId={column.space_id}
				isOpen={isCreateModalOpen}
				onClose={() => setCreateModalOpen(false)}
				columnId={column.id}
			/>
			{selectedTaskId && (
				<TaskModalView
					taskId={selectedTaskId}
					spaceId={column.space_id}
					isOpen={isViewModalOpen}
					onClose={() => {
						setViewModalOpen(false)
						setSelectedTaskId(null)
					}}
				/>
			)}
		</div>
	)
}
