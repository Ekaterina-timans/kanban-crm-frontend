'use client'

import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

import { IColumn } from '@/types/column.types'

import { useUpdateColumnsOrder } from '@/hooks/column/useUpdateColumnsOrder'

import { ColumnPosition } from './ColumnPosition'
import { SortableColumnPosition } from './SortableColumnPosition'
import { Button } from '@/components/ui/button/Button'

export function ColumnLayout({ columns }: { columns: IColumn[] }) {
	const [currentColumns, setCurrentColumns] = useState<IColumn[]>(columns)
	const { updateColumnsOrder, isPending } = useUpdateColumnsOrder()

	// Синхронизировать колонки при изменении props.columns
	useEffect(() => {
		setCurrentColumns(columns)
	}, [columns])

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	)

	// DnD обработчик
	const handleDragEnd = (event: any) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const oldIndex = currentColumns.findIndex(col => col.id === active.id)
		const newIndex = currentColumns.findIndex(col => col.id === over.id)
		setCurrentColumns(arrayMove(currentColumns, oldIndex, newIndex))
	}

	const handleSaveOrder = () => {
		// Отправляем новый порядок на сервер
		const payload = currentColumns.map((col, i) => ({
			id: col.id,
			position: i + 1
		}))
		updateColumnsOrder(payload)
	}

	return (
		<div>
			<h3 className='text-center mb-5'>Настройки расположения колонок</h3>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={currentColumns.map(col => col.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className='flex flex-col items-center justify-center'>
						{currentColumns.length > 0 ? (
							currentColumns.map(column => (
								<SortableColumnPosition
									key={column.id}
									id={column.id}
								>
									<ColumnPosition column={column} />
								</SortableColumnPosition>
							))
						) : (
							<div>Нет колонок</div>
						)}
					</div>
				</SortableContext>
			</DndContext>
			<div className='flex mt-5'>
				<Button
					variant='default'
					onClick={handleSaveOrder}
					className='px-4 py-2 rounded transition'
					disabled={isPending}
				>
					{isPending ? 'Сохраняю...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	)
}
