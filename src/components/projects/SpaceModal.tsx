import { useForm } from 'react-hook-form'

import { IModalProps, ISpaceForm } from '@/types/modal.types'

import { useCreateSpace } from '@/hooks/space/useCreateSpace'

import { Button } from '../ui/button/Button'
import Field from '../ui/field/Field'

import { ModalWrapper } from '../ui/modal/ModalWrapper'
import { BigField } from '../ui/field/big-field/BigField'

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
			className='w-96'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2 className='text-lg mb-4 text-center'>Создание нового пространства</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
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
				<div className='flex justify-between'>
					<Button type='submit'>Сохранить</Button>
					<Button onClick={onClose}>Отмена</Button>
				</div>
			</form>
		</ModalWrapper>
	)
}
