'use client'

import Circle from '@uiw/react-color-circle'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { ModalWrapper } from '@/components/ui/modal/ModalWrapper'

import { Colors } from '@/types/column.types'
import { IColumnForm, IModalProps } from '@/types/modal.types'

import { useCreateColumn } from '@/hooks/column/useCreateColumn'
import { useUpdateColumn } from '@/hooks/column/useUpdateColumn'

interface IColumnModalProps extends IModalProps {
	spaceId: string
	existingColumns: number
	mode: 'create' | 'edit'
	columnData?: {
		id: string
		name: string
		color: string
	}
}

export function ColumnModal({
	isOpen,
	onClose,
	spaceId,
	existingColumns,
	mode = 'create',
	columnData
}: IColumnModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<IColumnForm>({
		mode: 'onChange'
	})

	const { createColumn } = useCreateColumn()
	const { updateColumn } = useUpdateColumn(columnData?.id)
	const [hex, setHex] = useState<string>(columnData?.color || '#EE82EE')

	useEffect(() => {
		if (!isOpen) return

		if (mode === 'edit' && columnData) {
			reset({ name: columnData.name })
			setHex(columnData.color)
		} else if (mode === 'create') {
			reset({ name: '' })
			setHex('#EE82EE')
		}
	}, [isOpen, mode, columnData, reset])

	const onSubmit = async (data: IColumnForm) => {
		if (mode === 'create') {
			const position = existingColumns === 0 ? 1 : existingColumns + 1
			const columnPayload = { ...data, space_id: spaceId, position, color: hex }

			try {
				await createColumn(columnPayload)
				reset()
				onClose()
			} catch (error) {
				console.log('Error creating column:', error)
			}
		} else if (mode === 'edit' && columnData) {
			const columnPayload = { ...data, color: hex }
			try {
				await updateColumn({ id: columnData.id, data: columnPayload })
				onClose()
			} catch (error) {
				console.log('Error updating column:', error)
			}
		}
	}

	if (!isOpen) return null

	return (
		<ModalWrapper
			className='w-96'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2>
				{mode === 'create'
					? 'Создание новой колонки'
					: 'Редактирование колонки'}
			</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Field
					{...register('name', { required: 'Введите наименование колонки' })}
					placeholder='Наименование колонки'
					className='mb-4'
					error={errors.name}
				/>
				<div className='mb-4'>
					<p>Выберите цвет фона</p>
					<Circle
						colors={Colors}
						color={hex}
						pointProps={{
							style: {
								width: 30,
								height: 30
							}
						}}
						onChange={color => setHex(color.hex)}
					/>
				</div>
				<div className='flex justify-between'>
					<Button type='submit'>
						{mode === 'create' ? 'Создать' : 'Сохранить'}
					</Button>
					<Button
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
