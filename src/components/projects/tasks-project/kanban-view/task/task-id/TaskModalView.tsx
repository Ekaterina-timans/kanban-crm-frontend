'use client'

import { Check, Copy, Minimize2, MoveDiagonal, Pencil, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/ui/modal/ModalWrapper'

import { Permission } from '@/types/permission.enum'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useTask } from '@/hooks/task/useTask'
import { useUpdateTask } from '@/hooks/task/useUpdateTaskDetails'

import { TaskCommentsPanel } from './comments/TaskCommentsPanel'
import { TaskDetailsPanel } from './details/TaskDetailsPanel'
import { cn } from '@/lib/utils'

export function TaskModalView({
	taskId,
	spaceId,
	isOpen,
	onClose
}: {
	taskId: string
	spaceId: string
	isOpen: boolean
	onClose: () => void
}) {
	const [isFullScreen, setFullScreen] = useState(false)
	const { data: task, isLoading } = useTask(taskId)
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState(task?.name || '')

	const { updateName } = useUpdateTask()

	const { can } = useSpaceAccessStore()
	const canEditTask = can(Permission.TASK_EDIT)

	if (!isOpen) return null
	if (isLoading || !task) return null

	const handleEditToggle = () => {
		setIsEditing(!isEditing)
		setEditedName(task.name)
	}

	const handleSave = () => {
		if (!editedName.trim() || editedName === task.name) {
			setIsEditing(false)
			return
		}

		updateName(
			{ taskId: task.id, name: editedName },
			{
				onSuccess: () => {
					setIsEditing(false)
				}
			}
		)
	}

	return (
		<ModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			className={cn(
				'!max-w-none w-[1100px] max-h-[90vh] bg-card border border-border shadow-xl rounded-2xl overflow-hidden',
				'transition-[width,height] duration-200',
				'flex flex-col',
				isFullScreen && 'w-[95vw] h-[95vh]'
			)}
		>
			{/* Заголовок */}
			<div className='flex items-start justify-between border-b border-border'>
				<div className='flex flex-col'>
					<div className='flex items-center gap-2'>
						<h2 className='text-xl font-semibold text-foreground'>
							{isEditing ? (
								<input
									type='text'
									value={editedName}
									onChange={e => setEditedName(e.target.value)}
									className='h-9 rounded-xl border border-input bg-background px-3 text-base text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
									autoFocus
								/>
							) : (
								<>
									<span>{task.name}</span>
								</>
							)}
						</h2>
						{canEditTask &&
							(isEditing ? (
								<Button
									variant='ghost'
									size='icon'
									onClick={handleSave}
									Icon={Check}
									iconClassName='text-green-600'
									title='Сохранить'
								/>
							) : (
								<Button
									variant='ghost'
									size='sm'
									onClick={handleEditToggle}
									Icon={Pencil}
									iconClassName='text-blue-500'
									title='Редактировать название'
								/>
							))}
					</div>
					<div className='flex items-center gap-3 mt-1'>
						<span className='text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border'>
							ID: #{task.id}
						</span>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => navigator.clipboard.writeText(`#${task.id}`)}
							className='flex items-center gap-1 text-muted-foreground hover:text-primary'
						>
							<Copy className='w-4 h-4' />
							<span className='text-sm'>Скопировать ID</span>
						</Button>
					</div>
					<p className='text-sm text-gray-500 mt-1'>
						Создано: {new Date(task.created_at).toLocaleDateString('ru-RU')}
						{task.author && (
							<>
								{' '}
								•{' '}
								<span className='text-gray-700 font-medium'>
									Автор: {task.author.name || task.author.email}
								</span>
							</>
						)}
					</p>
				</div>

				<div className='flex gap-2'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setFullScreen(!isFullScreen)}
						Icon={isFullScreen ? Minimize2 : MoveDiagonal}
						iconClassName='text-blue-500'
						title={isFullScreen ? 'Свернуть' : 'Развернуть'}
					/>
					<Button
						variant='ghost'
						size='icon'
						onClick={onClose}
						Icon={X}
						className='hover:bg-destructive/10 transition-colors'
						iconClassName='text-destructive'
					/>
				</div>
			</div>

			{/* Контент */}
			<div className='grid grid-cols-2 gap-3 flex-1 min-h-0 pt-3'>
				<TaskDetailsPanel
					task={task}
					spaceId={spaceId}
				/>
				<TaskCommentsPanel
					taskId={task.id}
					spaceId={spaceId}
				/>
			</div>
		</ModalWrapper>
	)
}
