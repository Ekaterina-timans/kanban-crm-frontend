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
			className={`p-1 ${
				isFullScreen ? 'w-[95vw] h-[95vh]' : 'w-[1100px] max-h-[90vh]'
			} transition-all`}
		>
			{/* Заголовок */}
			<div className='flex justify-between items-start border-b pb-2 mb-1'>
				<div className='flex flex-col'>
					<div className='flex items-center gap-2'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{isEditing ? (
								<input
									type='text'
									value={editedName}
									onChange={e => setEditedName(e.target.value)}
									className='border border-blue-400 rounded px-2 py-1 text-lg focus:outline-blue-500'
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
						<span className='text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded'>
							ID: #{task.id}
						</span>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => navigator.clipboard.writeText(`#${task.id}`)}
							className='flex items-center gap-1 text-blue-600 hover:text-blue-700'
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
						iconClassName='text-red-500'
					/>
				</div>
			</div>

			{/* Контент */}
			<div className='grid grid-cols-2 gap-1 h-[70vh]'>
				<TaskDetailsPanel
					task={task}
					spaceId={spaceId}
				/>
				<TaskCommentsPanel taskId={task.id} spaceId={spaceId} />
			</div>
		</ModalWrapper>
	)
}
