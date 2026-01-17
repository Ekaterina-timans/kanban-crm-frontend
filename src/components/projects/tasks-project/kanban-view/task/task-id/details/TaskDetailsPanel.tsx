'use client'

import { useEffect, useState } from 'react'

import { CalendarComponent } from '@/components/ui/calendar/CalendarComponent'
import { BigField } from '@/components/ui/field/big-field/BigField'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { Permission } from '@/types/permission.enum'
import { ITask } from '@/types/task.types'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useCreateChecklist } from '@/hooks/check-list/useCreateChecklist'
import { useCreateChecklistItem } from '@/hooks/check-list/useCreateChecklistItem'
import { useDeleteChecklist } from '@/hooks/check-list/useDeleteChecklist'
import { useDeleteChecklistItem } from '@/hooks/check-list/useDeleteChecklistItem'
import { useGetChecklists } from '@/hooks/check-list/useGetChecklists'
import { useUpdateChecklist } from '@/hooks/check-list/useUpdateChecklist'
import { useUpdateChecklistItem } from '@/hooks/check-list/useUpdateChecklistItem'
import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useUpdateTask } from '@/hooks/task/useUpdateTaskDetails'

import { formatDate } from '@/utils/date-utils'
import { getPriorityOptions, getStatusOptions } from '@/utils/selectOptions'

import { ChecklistList } from './ChecklistList'
import { cn } from '@/lib/utils'

export function TaskDetailsPanel({
	task,
	spaceId
}: {
	task: ITask
	spaceId: string
}) {
	const {
		updateDescription,
		updateStatus,
		updatePriority,
		updateDueDate,
		updateAssignee
	} = useUpdateTask()

	const { data: spaceUsers = [], isLoading: usersLoading } =
		useGetSpaceUsers(spaceId)

	const { checklists, isLoading } = useGetChecklists(task.id)
	const { createChecklist } = useCreateChecklist()
	const { updateChecklist } = useUpdateChecklist()
	const { deleteChecklist } = useDeleteChecklist()
	const { createChecklistItem } = useCreateChecklistItem()
	const { updateChecklistItem } = useUpdateChecklistItem()
	const { deleteChecklistItem } = useDeleteChecklistItem()

	const { can } = useSpaceAccessStore()
	const canEditTask = can(Permission.TASK_EDIT)

	const statusOptions = getStatusOptions()
	const priorityOptions = getPriorityOptions()
	const [description, setDescription] = useState(task.description ?? '')

	useEffect(() => {
		setDescription(task.description ?? '')
	}, [task.id, task.description])

	const handleAssigneeChange = (value: string) => {
		updateAssignee({
			taskId: String(task.id),
			assigneeId: value === 'none' ? null : Number(value)
		})
	}

	const assigneeOptions = [
		{ value: 'none', label: 'Не назначен' },
		...spaceUsers.map((su: any) => ({
			value: String(su.user.id),
			label: su.user.name || su.user.email
		}))
	]

	const handleAddChecklist = () => {
		createChecklist({ taskId: task.id, title: 'Новый чек-лист' })
	}

	const handleAddItem = (listId: number) => {
		createChecklistItem({
			checklistId: listId,
			taskId: task.id,
			item: { name: 'Новый пункт' }
		})
	}

	const handleDeleteItem = (listId: number, itemId: number) => {
		deleteChecklistItem(String(itemId))
	}

	const handleToggleItem = (
		listId: number,
		itemId: number,
		completed: boolean
	) => {
		updateChecklistItem({
			itemId,
			taskId: task.id,
			body: { completed }
		})
	}

	const handleChangeDate = (
		listId: number,
		itemId: number,
		date: Date | null
	) => {
		updateChecklistItem({
			itemId,
			taskId: task.id,
			body: { due_date: date ? formatDate(date) : null }
		})
	}

	return (
		<ScrollArea className='h-full pr-2'>
			<div className='space-y-5 pb-2 pl-1'>
				<div>
					<h3 className='font-semibold text-blue-600 mb-1'>Ответственный</h3>
					{usersLoading ? (
						<p className='text-sm text-gray-400'>Загрузка...</p>
					) : (
						<SelectComponent
							options={assigneeOptions}
							placeholder='Выберите ответственного'
							selectedValue={
								task.assignee_id ? String(task.assignee_id) : 'none'
							}
							onChange={handleAssigneeChange}
							disabled={!canEditTask}
						/>
					)}
				</div>
				<div>
					<h3 className='font-semibold text-blue-600 mb-50'>Описание</h3>
					<BigField
						value={description}
						placeholder='Введите описание задачи...'
						onChange={e => setDescription(e.target.value)}
						onBlur={e => {
							const newDescription = e.target.value.trim()
							const prev = (task.description ?? '').trim()
							if (newDescription !== prev) {
								updateDescription({
									taskId: task.id,
									description: newDescription
								})
							}
						}}
						className={cn(!canEditTask && 'opacity-70 cursor-not-allowed')}
					/>
				</div>
				<div className='flex gap-6'>
					<div className='flex-1'>
						<h3 className='font-semibold text-blue-600 mb-2'>Статус</h3>
						<SelectComponent
							options={statusOptions}
							placeholder='Выберите статус'
							selectedValue={String(task.status_id)}
							onChange={val =>
								updateStatus({
									taskId: task.id,
									statusId: Number(val)
								})
							}
							disabled={!canEditTask}
						/>
					</div>

					<div className='flex-1'>
						<h3 className='font-semibold text-blue-600 mb-2'>Приоритет</h3>
						<SelectComponent
							options={priorityOptions}
							placeholder='Выберите приоритет'
							selectedValue={String(task.priority_id)}
							onChange={val =>
								updatePriority({
									taskId: task.id,
									priorityId: Number(val)
								})
							}
							disabled={!canEditTask}
						/>
					</div>
				</div>
				<div>
					<h3 className='font-semibold text-blue-600 mb-2'>Срок выполнения</h3>
					<CalendarComponent
						value={task.due_date ? new Date(task.due_date) : null}
						placeholder='Выберите дату'
						clearable
						onDateChange={(date: Date) =>
							updateDueDate({
								taskId: task.id,
								dueDate: formatDate(date)
							})
						}
						onClear={() =>
							updateDueDate({
								taskId: task.id,
								dueDate: null
							})
						}
						disabled={!canEditTask}
					/>
				</div>
				<div>
					{isLoading ? (
						<p className='text-sm text-gray-400'>Загрузка...</p>
					) : (
						<ChecklistList
							checklists={checklists}
							onAddChecklist={handleAddChecklist}
							onUpdateChecklist={(id, title) =>
								updateChecklist({ checklistId: id, taskId: task.id, title })
							}
							onDeleteChecklist={id => deleteChecklist(id)}
							onAddItem={handleAddItem}
							onDeleteItem={handleDeleteItem}
							onToggleItem={handleToggleItem}
							onUpdateItemName={(listId, itemId, name) =>
								updateChecklistItem({
									itemId,
									taskId: task.id,
									body: { name }
								})
							}
							onChangeDate={handleChangeDate}
							onChangeAssignee={(listId, itemId, userId) =>
								updateChecklistItem({
									itemId,
									taskId: task.id,
									body: {
										assignee_id: userId === 'none' ? null : Number(userId)
									}
								})
							}
							users={spaceUsers}
							canEditTask={canEditTask}
						/>
					)}
				</div>
			</div>
		</ScrollArea>
	)
}
