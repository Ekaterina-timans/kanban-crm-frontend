'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import { CalendarComponent } from '@/components/ui/calendar/CalendarComponent'
import Field from '@/components/ui/field/Field'
import { BigField } from '@/components/ui/field/big-field/BigField'
import { ModalWrapper } from '@/components/ui/modal/ModalWrapper'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { IModalProps, ITaskForm } from '@/types/modal.types'
import { PriorityId, StatusId } from '@/types/task.types'

import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useCreateTask } from '@/hooks/task/useCreateTask'

import { formatDate } from '@/utils/date-utils'
import { getPriorityOptions } from '@/utils/selectOptions'

interface ITaskModalProps extends IModalProps {
	columnId: string
	spaceId: string
}

export function TaskModal({
	isOpen,
	onClose,
	columnId,
	spaceId
}: ITaskModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<ITaskForm>({
		mode: 'onChange'
	})

	const { createTask } = useCreateTask()
	const { data: spaceUsers = [], isLoading: usersLoading } =
		useGetSpaceUsers(spaceId)
	const priorityOptions = getPriorityOptions()
	const [selectedPriority, setSelectedPriority] = useState<string>('')
	const [selectedAssignee, setSelectedAssignee] = useState<string>('none')

	if (!isOpen) return null

	const assigneeOptions = [
		{ value: 'none', label: 'Не назначен' },
		...spaceUsers.map((su: any) => ({
			value: String(su.user.id),
			label: su.user.name || su.user.email
		}))
	]

	const onSubmit = async (data: ITaskForm) => {
		const taskData = {
			...data,
			column_id: columnId,
			status_id: 1 as StatusId,
			due_date: formatDate(data.due_date),
			assignee_id: selectedAssignee === 'none' ? null : Number(selectedAssignee)
		}

		try {
			await createTask(taskData)
			reset()
			onClose()
		} catch (error) {
			console.log('Error creating task:', error)
		}
	}

	return (
		<ModalWrapper
			className='w-full max-w-md'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2 className='text-xl font-semibold tracking-tight text-center'>
				Создание новой задачи
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='mt-6 space-y-4'
			>
				<Field
					{...register('name', {
						required: 'Введите наименование задачи'
					})}
					placeholder='Наименование задачи'
					className='mb-4'
					error={errors.name}
				/>
				<BigField
					{...register('description', {
						required: false
					})}
					placeholder='Описание задачи'
					className='mb-4'
				/>
				{usersLoading ? (
					<p className='text-sm text-gray-400 mb-3'>
						Загрузка пользователей...
					</p>
				) : (
					<SelectComponent
						options={assigneeOptions}
						placeholder='Выберите ответственного'
						selectedValue={selectedAssignee}
						onChange={val => setSelectedAssignee(val)}
						className='mb-4'
					/>
				)}
				<SelectComponent
					options={priorityOptions}
					placeholder='Выберите приоритет задачи'
					selectedValue={selectedPriority}
					onChange={selectedValue => {
						const priorityId = Number(selectedValue) as PriorityId
						setValue('priority_id', priorityId)
						setSelectedPriority(selectedValue)
					}}
					className='mb-4'
				/>
				<CalendarComponent
					setValue={setValue}
					fieldName='due_date'
					className='mb-4'
				/>
				<div className='mt-6 flex items-center justify-end gap-3'>
					<Button
						variant='default'
						type='submit'
					>
						Создать
					</Button>
					<Button
						variant='secondary'
						type='button'
						onClick={onClose}
					>
						Отменить
					</Button>
				</div>
			</form>
		</ModalWrapper>
	)
}
