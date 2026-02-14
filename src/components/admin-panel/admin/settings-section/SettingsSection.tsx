'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'

import { useAuth } from '@/providers/AuthProvider'

import { useDeleteGroup } from '@/hooks/group/useDeleteGroup'
import { useUpdateGroup } from '@/hooks/group/useUpdateGroup'

import { groupService } from '@/services/group.service'

type FormValues = {
	name: string
	description: string
	invite_policy: 'admin_only' | 'all'
}

export function SettingsSection() {
	const { currentGroupId } = useAuth()
	const { updateGroup, isPending } = useUpdateGroup(currentGroupId!)
	const { deleteGroup, isPending: isDeleting } = useDeleteGroup()

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<FormValues>({
		defaultValues: {
			name: '',
			description: '',
			invite_policy: 'admin_only'
		}
	})

	useEffect(() => {
		if (!currentGroupId) return

		groupService.getGroupById(currentGroupId).then(group => {
			reset({
				name: group.name || '',
				description: group.description || '',
				invite_policy: group.invite_policy ?? 'admin_only'
			})
		})
	}, [currentGroupId, reset])

	const onSubmit = async (data: FormValues) => {
		if (!currentGroupId) return
		await updateGroup(data)
	}

	const handleDelete = () => {
		if (!currentGroupId) return

		const yes = confirm(
			'Вы уверены, что хотите удалить группу? Это действие необратимо.'
		)

		if (yes) {
			deleteGroup(currentGroupId)
		}
	}

	return (
		<div className='space-y-4 max-w-xl'>
			<h3 className='text-xl font-semibold text-primary'>Настройки группы</h3>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm space-y-4'
			>
				<div>
					<label className='text-sm font-semibold'>Название группы</label>
					<input
						{...register('name', { required: 'Название обязательно' })}
						className='w-full border border-input rounded-lg p-2 mt-1 text-sm bg-background text-foreground'
					/>
					{errors.name && (
						<p className='text-destructive text-xs mt-1'>
							{errors.name.message}
						</p>
					)}
				</div>

				<div>
					<label className='text-sm font-semibold'>Описание</label>
					<textarea
						{...register('description')}
						rows={3}
						className='w-full border border-input rounded-lg p-2 mt-1 text-sm bg-background text-foreground'
					/>
				</div>

				<div>
					<label className='text-sm font-semibold'>
						Кто может приглашать участников
					</label>

					<Controller
						name='invite_policy'
						control={control}
						render={({ field }) => (
							<div className='mt-2 space-y-1 text-sm'>
								<label className='flex items-center gap-2'>
									<input
										type='radio'
										value='admin_only'
										checked={field.value === 'admin_only'}
										onChange={() => field.onChange('admin_only')}
									/>
									<span>Только администратор</span>
								</label>

								<label className='flex items-center gap-2'>
									<input
										type='radio'
										value='all'
										checked={field.value === 'all'}
										onChange={() => field.onChange('all')}
									/>
									<span>Все участники</span>
								</label>
							</div>
						)}
					/>
				</div>

				<Button
					variant='default'
					type='submit'
					disabled={isPending}
					className='px-4 py-2 transition text-sm font-medium'
				>
					{isPending ? 'Сохранение...' : 'Сохранить изменения'}
				</Button>
			</form>

			<div className='bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm space-y-3'>
				<h4 className='font-semibold'>Удаление группы</h4>
				<p className='text-sm text-muted-foreground'>
					После удаления группа и все данные будут безвозвратно удалены.
				</p>

				<Button
					variant='destructive'
					onClick={handleDelete}
					disabled={isDeleting}
					className='px-4 py-2 transition text-sm font-medium'
				>
					{isDeleting ? 'Удаление...' : 'Удалить группу'}
				</Button>
			</div>
		</div>
	)
}
