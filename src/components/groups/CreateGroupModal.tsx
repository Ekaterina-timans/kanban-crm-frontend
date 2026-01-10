import { useForm } from 'react-hook-form'

import { IGroupForm, IModalProps } from '@/types/modal.types'

import { useCreateGroup } from '@/hooks/group/useCreateGroup'

import { Button } from '../ui/button/Button'
import Field from '../ui/field/Field'
import { BigField } from '../ui/field/big-field/BigField'
import { ModalWrapper } from '../ui/modal/ModalWrapper'

export function CreateGroupModal({ isOpen, onClose }: IModalProps) {
	if (!isOpen) return null

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<IGroupForm>({
		mode: 'onChange'
	})

	const { createGroup, isPending } = useCreateGroup()

	const onSubmit = async (data: IGroupForm) => {
		try {
			await createGroup(data)
			reset()
			onClose()
		} catch (error) {
			console.log('Error creating group:', error)
		}
	}

	return (
		<ModalWrapper
			className='max-w-md'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='space-y-1 text-center'>
				<h2 className='text-xl font-semibold tracking-tight'>
					Создание новой группы
				</h2>
				<p className='text-sm text-muted-foreground'>
					Укажите название и при необходимости добавьте описание.
				</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='mt-6 space-y-4'
			>
				<Field
					{...register('name', { required: 'Введите название группы' })}
					placeholder='Название группы'
					className='mb-4'
					error={errors.name}
				/>
				<BigField
					{...register('description')}
					placeholder='Описание группы'
					className='mb-12'
				/>
				<div className='mt-6 flex items-center justify-end gap-3'>
					<Button
						variant='default'
						type='submit'
						disabled={isPending}
					>
						{isPending ? 'Создаём...' : 'Сохранить'}
					</Button>
					<Button
						variant='secondary'
						onClick={onClose}
						type='button'
					>
						Отмена
					</Button>
				</div>
			</form>
		</ModalWrapper>
	)
}
