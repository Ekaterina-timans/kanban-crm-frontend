'use client'

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	pointerWithin,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { IColumnTask } from '@/types/column.types'
import { Permission } from '@/types/permission.enum'
import { ITask } from '@/types/task.types'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useUpdateTaskId } from '@/hooks/task/useUpdateTaskId'

import { Column } from './column/Column'
import { ColumnModal } from './column/ColumnModal'
import { CardTask } from './task/CardTask'

export function KanbanView({
	id,
	columns
}: {
	id: string
	columns: IColumnTask[]
}) {
	const [isModalOpen, setModalOpen] = useState(false)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
	const [editingColumn, setEditingColumn] = useState<IColumnTask | null>(null)
	const [existingColumns, setExistingColumns] = useState(0)
	const [currentColumns, setCurrentColumns] = useState<IColumnTask[]>(columns)
	const [activeId, setActiveId] = useState<string | null>(null)

	const { updateTaskColumn } = useUpdateTaskId()

	useEffect(() => {
		if (columns) {
			setExistingColumns(columns.length)
			setCurrentColumns(columns)
		}
	}, [columns])

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 10
		}
	})

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: 250,
			tolerance: 5
		}
	})

	const keyboardSensor = useSensor(KeyboardSensor, {
		coordinateGetter: sortableKeyboardCoordinates
	})

	const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

	const openCreateModal = () => {
		setModalMode('create')
		setEditingColumn(null)
		setModalOpen(true)
	}

	const openEditModal = (column: IColumnTask) => {
		setModalMode('edit')
		setEditingColumn(column)
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setEditingColumn(null)
	}

	// Найти колонку, в которой находится задача
	const findTaskColumn = (taskId: string) =>
		currentColumns.find(col => col.tasks.some(task => task.id === taskId))

	// Переместить задачу в другую колонку
	const moveTask = (taskId: string, targetColumnId: string) => {
		setCurrentColumns(prevCols => {
			let taskToMove: ITask | null = null
			const newCols = prevCols
				.map(col => {
					if (col.tasks.some(task => task.id === taskId)) {
						taskToMove = col.tasks.find(task => task.id === taskId) || null
						return {
							...col,
							tasks: col.tasks.filter(task => task.id !== taskId)
						}
					}
					return col
				})
				.map(col => {
					if (col.id === targetColumnId && taskToMove) {
						return { ...col, tasks: [...col.tasks, taskToMove] }
					}
					return col
				})
			return newCols
		})
	}

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || !active) {
			setActiveId(null)
			return
		}

		const activeTaskId = active.id as string
		const overColumnId = over.data?.current?.columnId

		if (!overColumnId) {
			setActiveId(null)
			return
		}

		const activeColumn = findTaskColumn(activeTaskId)

		if (!activeColumn || activeColumn.id === overColumnId) {
			setActiveId(null)
			return
		}

		moveTask(activeTaskId, overColumnId)
		updateTaskColumn({
			taskId: activeTaskId,
			columnId: overColumnId
		})

		setActiveId(null)
	}

	const canCreateColumn = useSpaceAccessStore
		.getState()
		.can(Permission.COLUMN_CREATE)

	// Функция рендера задачи, передаём в Column и используем в DragOverlay
	const renderTask = (task: ITask) => {
		return <CardTask task={task} />
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className='flex px-6 py-5 gap-6 overflow-x-auto'>
				{currentColumns && currentColumns.length > 0
					? currentColumns.map(column => (
							<Column
								key={column.id}
								column={column}
								onEdit={() => openEditModal(column)}
								renderTask={renderTask}
							/>
						))
					: null}
				{canCreateColumn && (
					<Button
						type='button'
						variant='outline'
						size='icon'
						onClick={openCreateModal}
						className='h-12 w-12 shrink-0'
					>
						<Tooltip text='Добавить колонку'>
							<Plus />
						</Tooltip>
					</Button>
				)}
			</div>
			<DragOverlay>
				{activeId
					? (() => {
							const activeTask = currentColumns
								.flatMap(col => col.tasks)
								.find(task => task.id === activeId)
							return activeTask ? renderTask(activeTask) : null
						})()
					: null}
			</DragOverlay>
			<ColumnModal
				isOpen={isModalOpen}
				onClose={closeModal}
				spaceId={id}
				existingColumns={existingColumns}
				mode={modalMode}
				columnData={
					editingColumn
						? {
								id: editingColumn.id,
								name: editingColumn.name,
								color: editingColumn.color
							}
						: undefined
				}
			/>
		</DndContext>
	)
}
