import { useForm } from 'react-hook-form'

import { IModalProps, ISpaceForm } from '@/types/modal.types'

import { useCreateSpace } from '@/hooks/space/useCreateSpace'

import { Button } from '../ui/button/Button'
import Field from '../ui/field/Field'
import { BigField } from '../ui/field/big-field/BigField'
import { ModalWrapper } from '../ui/modal/ModalWrapper'

export function SpaceModal({ isOpen, onClose }: IModalProps) {
	if (!isOpen) return null

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<ISpaceForm>({
		mode: 'onChange'
	})

	const { createSpace } = useCreateSpace()

	const onSubmit = async (data: ISpaceForm) => {
		try {
			await createSpace(data)
			reset()
			onClose()
		} catch (error) {
			console.log('Error creating space:', error)
		}
	}

	return (
		<ModalWrapper
			className='w-full max-w-md'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='space-y-1 text-center'>
				<h2 className='text-xl font-semibold tracking-tight'>
					Создание нового пространства
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
					{...register('name', {
						required: 'Введите наименование пространства'
					})}
					placeholder='Наименование пространства'
					className='mb-4'
					error={errors.name}
				/>
				<BigField
					{...register('description', {
						required: false
					})}
					placeholder='Описание пространства'
					className='mb-12'
				/>
				<div className='mt-6 flex items-center justify-end gap-3'>
					<Button
						variant='default'
						type='submit'
					>
						Сохранить
					</Button>
					<Button
						variant='secondary'
						onClick={onClose}
					>
						Отмена
					</Button>
				</div>
			</form>
		</ModalWrapper>
	)
}
