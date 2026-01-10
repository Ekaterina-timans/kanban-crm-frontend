'use client'

import Circle from '@uiw/react-color-circle'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { BigField } from '@/components/ui/field/big-field/BigField'

import { Colors } from '@/types/column.types'
import { ISpaceForm } from '@/types/modal.types'
import { ISpaceResponse, TypeSpaceFormState } from '@/types/space.types'

import { useUpdateSpace } from '@/hooks/space/useUpdateSpace'

export function SpaceSettings({ items }: { items: ISpaceResponse }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
		reset
	} = useForm<ISpaceForm>({
		mode: 'onChange',
		defaultValues: {
			name: items.name,
			description: items.description,
			backgroundImage: null,
			backgroundColor: items.backgroundColor || '#DDEBFF'
		}
	})

	const [backgroundColor, setBackgroundColor] = useState<string>(
		items.backgroundColor || '#DDEBFF'
	)
	const [useColor, setUseColor] = useState<boolean>(
		!!items.backgroundImage ? false : true
	)

	const fileList = watch('backgroundImage')

	const { updateSpace, isPending } = useUpdateSpace(items.id)

	useEffect(() => {
		// Если пользователь загрузил файл, переключаем на использование изображения
		if (fileList && fileList.length > 0) {
			setUseColor(false)
		}
	}, [fileList])

	const onSubmit = async (data: ISpaceForm) => {
		let file: File | undefined = undefined

		if (data.backgroundImage && data.backgroundImage.length > 0) {
			file = data.backgroundImage[0]
		}

		const payload: TypeSpaceFormState = {
			name: data.name,
			description: data.description,
			backgroundColor: useColor ? backgroundColor : '',
			backgroundImage: !useColor && file ? file : undefined
		}

		try {
			await updateSpace({ id: items.id, data: payload })
			reset({
				...data,
				backgroundImage: null
			})
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div>
			<h3 className='text-center'>Настройки пространства</h3>
			<form
				className='mt-5'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Field
					{...register('name', {
						required: 'Введите наименование пространства'
					})}
					label='Наименование пространства'
					className='mb-4'
					error={errors.name}
				/>
				<BigField
					{...register('description')}
					label='Описание пространства'
					className='mb-4'
				/>
				<div className='mb-4'>
					<p className='mb-2 font-medium'>Фон пространства</p>
					<label className='inline-flex items-center mr-4 cursor-pointer'>
						<input
							type='radio'
							checked={useColor}
							onChange={() => {
								setUseColor(true)
								setBackgroundColor('')
								setValue('backgroundColor', '')
								setValue('backgroundImage', null) // очищаем файл
							}}
							className='mr-2'
						/>
						Цвет
					</label>
					<label className='inline-flex items-center cursor-pointer'>
						<input
							type='radio'
							checked={!useColor}
							onChange={() => setUseColor(false)}
							className='mr-2'
						/>
						Изображение
					</label>
				</div>

				{useColor ? (
					<div className='mb-4'>
						<Circle
							colors={Colors}
							color={backgroundColor || undefined}
							pointProps={{ style: { width: 30, height: 30 } }}
							onChange={color => setBackgroundColor(color.hex)}
						/>
					</div>
				) : (
					<div className='mb-4'>
						<label className='block text-base font-medium text-gray-700 mb-1'>
							Загрузить изображение
						</label>
						<input
							type='file'
							accept='image/*'
							{...register('backgroundImage')}
							className='block w-full text-sm text-gray-500
								file:mr-4 file:py-2 file:px-4
								file:rounded-md file:border-0
								file:text-sm file:font-semibold
								file:bg-blue-50 file:text-blue-700
								hover:file:bg-blue-100'
						/>
						{fileList && fileList.length > 0 && (
							<p className='mt-2 text-sm text-gray-600'>
								Выбрано: {fileList[0].name}
							</p>
						)}
						{items.backgroundImage && (!fileList || fileList.length === 0) && (
							<p className='mt-2 text-sm text-gray-600'>
								Текущее изображение установлено
							</p>
						)}
					</div>
				)}
				<Button
					variant='default'
					type='submit'
					className='btn mt-4'
					disabled={isPending}
				>
					{isPending ? 'Сохраняю...' : 'Сохранить'}
				</Button>
			</form>
		</div>
	)
}
