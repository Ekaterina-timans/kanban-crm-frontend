import { useForm } from 'react-hook-form'

import { IGroupForm, IModalProps } from '@/types/modal.types'

import { useCreateGroup } from '@/hooks/group/useCreateGroup'

import { Button } from '../ui/button/Button'
import Field from '../ui/field/Field'

import { ModalWrapper } from '../ui/modal/ModalWrapper'
import { BigField } from '../ui/field/big-field/BigField'

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
			className='w-96'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2 className='text-lg mb-4 text-center font-bold'>
				Создание новой группы
			</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
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
				<div className='flex justify-between'>
					<Button
						type='submit'
						disabled={isPending}
					>
						{isPending ? 'Создаём...' : 'Сохранить'}
					</Button>
					<Button
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
