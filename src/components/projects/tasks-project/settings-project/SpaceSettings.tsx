'use client'

import Circle from '@uiw/react-color-circle'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { BigField } from '@/components/ui/field/big-field/BigField'

import {
	DEFAULT_SPACE_COLOR,
	SPACE_BACKGROUND_COLORS_DARK,
	SPACE_BACKGROUND_COLORS_LIGHT,
	SPACE_BG_DARK_MAP,
	SPACE_BG_LIGHT_MAP
} from '@/constants/colors'

import { ISpaceForm } from '@/types/modal.types'
import { ISpaceResponse, TypeSpaceFormState } from '@/types/space.types'

import { useUpdateSpace } from '@/hooks/space/useUpdateSpace'

function useIsDarkByHtmlClass() {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		const el = document.documentElement
		const update = () => setIsDark(el.classList.contains('dark'))
		update()

		const obs = new MutationObserver(update)
		obs.observe(el, { attributes: true, attributeFilter: ['class'] })
		return () => obs.disconnect()
	}, [])

	return isDark
}

export function SpaceSettings({ items }: { items: ISpaceResponse }) {
	const isDark = useIsDarkByHtmlClass()

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
			// В БД храним ТОЛЬКО light-hex
			backgroundColor: items.backgroundColor || DEFAULT_SPACE_COLOR
		}
	})

	// state хранит ТОЛЬКО light-hex (то, что уйдёт на бэк)
	const [backgroundColor, setBackgroundColor] = useState<string>(
		items.backgroundColor || DEFAULT_SPACE_COLOR
	)

	const [useColor, setUseColor] = useState<boolean>(
		!!items.backgroundImage ? false : true
	)

	const fileList = watch('backgroundImage')
	const { updateSpace, isPending } = useUpdateSpace(items.id)

	useEffect(() => {
		if (fileList && fileList.length > 0) setUseColor(false)
	}, [fileList])

	// Палитра в UI зависит от темы
	const palette = useMemo(
		() =>
			isDark ? SPACE_BACKGROUND_COLORS_DARK : SPACE_BACKGROUND_COLORS_LIGHT,
		[isDark]
	)

	// Какой цвет подсветить в Circle:
	// - state хранит light
	// - в dark UI нужно подсветить dark-аналог
	const uiSelectedColor = useMemo(() => {
		const raw = (backgroundColor || DEFAULT_SPACE_COLOR).trim().toLowerCase()
		if (!isDark) return raw
		return SPACE_BG_DARK_MAP[raw] ?? raw
	}, [backgroundColor, isDark])

	const onSubmit = async (data: ISpaceForm) => {
		let file: File | undefined = undefined
		if (data.backgroundImage && data.backgroundImage.length > 0) {
			file = data.backgroundImage[0]
		}

		const payload: TypeSpaceFormState = {
			name: data.name,
			description: data.description,
			// сохраняем light-hex
			backgroundColor: useColor ? backgroundColor : '',
			backgroundImage: !useColor && file ? file : undefined
		}

		try {
			await updateSpace({ id: items.id, data: payload })
			reset({ ...data, backgroundImage: null })
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
								setValue('backgroundImage', null)
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
							colors={palette}
							color={uiSelectedColor || undefined}
							pointProps={{ style: { width: 30, height: 30 } }}
							onChange={color => {
								const picked = color.hex.trim().toLowerCase()

								// В dark пользователь выбирает dark-hex,
								// но сохраняем его light-аналог.
								const lightToSave = isDark
									? (SPACE_BG_LIGHT_MAP[picked] ?? picked)
									: picked

								setBackgroundColor(lightToSave)
								setValue('backgroundColor', lightToSave)
							}}
						/>
					</div>
				) : (
					<div className='mb-4'>
						<label className='block text-base font-medium text-foreground mb-1'>
							Загрузить изображение
						</label>

						<input
							type='file'
							accept='image/*'
							{...register('backgroundImage')}
							className='block w-full text-sm text-muted-foreground
								file:mr-4 file:py-2 file:px-4
								file:rounded-md file:border file:border-border
								file:text-sm file:font-semibold
								file:bg-muted file:text-foreground
								hover:file:bg-accent'
						/>

						{fileList && fileList.length > 0 && (
							<p className='mt-2 text-sm text-muted-foreground'>
								Выбрано: {fileList[0].name}
							</p>
						)}

						{items.backgroundImage && (!fileList || fileList.length === 0) && (
							<p className='mt-2 text-sm text-muted-foreground'>
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
