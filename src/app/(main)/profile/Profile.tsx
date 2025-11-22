'use client'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { IUserProfile } from '@/types/user.types'

import { TIMEZONE_OPTIONS } from '@/config/timezones.constants'

import { useTimezoneStore } from '@/store/useTimezoneStore'

import { useRefreshUser } from '@/hooks/user/useRefreshUser'
import { useUpdateUserProfile } from '@/hooks/user/useUpdateUserProfile'
import { useUserProfile } from '@/hooks/user/useUserProfile'
import { getPublicUrl } from '@/utils/getPublicUrl'

import { userPreferencesService } from '@/services/user-preferences.service'
import { formatDateForCard } from '@/utils/date-utils'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Profile() {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [isSavingTimezone, setSavingTimezone] = useState(false)
	const { data: user, isLoading } = useUserProfile()
	const { mutate: updateProfile, isPending } = useUpdateUserProfile()
	const { refreshUser } = useRefreshUser()
	const { timezone, setTimezone } = useTimezoneStore()
	const { register, handleSubmit, reset, watch } = useForm<IUserProfile>()
	const avatarFile = watch('avatar')

	// Инициализация данных пользователя
	useEffect(() => {
		if (user) {
			reset({
				name: user.name ?? '',
				email: user.email ?? '',
				avatar: null
			})
			if (typeof user.avatar === 'string') {
				setAvatarPreview(getPublicUrl(user.avatar))
			}
		}
	}, [user, reset])

	// Предпросмотр аватара
	useEffect(() => {
		const file = avatarFile instanceof FileList ? avatarFile[0] : null
		if (file) {
			const reader = new FileReader()
			reader.onload = () => setAvatarPreview(reader.result as string)
			reader.readAsDataURL(file)
		}
	}, [avatarFile])

	// Смена часового пояса (отдельный запрос)
	const handleTimezoneChange = async (value: string) => {
		setTimezone(value) // сразу меняем в сторе, чтобы UI обновился
		setSavingTimezone(true)
		try {
			await userPreferencesService.setTimezone(value)
			toast.success('Часовой пояс обновлён')
		} catch {
			toast.error('Ошибка при сохранении часового пояса')
		} finally {
			setSavingTimezone(false)
		}
	}

	// Сохранение профиля
	const onSubmit = async (data: IUserProfile) => {
		const formData = new FormData()
		formData.append('name', data.name || '')
		formData.append('email', data.email)
		if (data.password) formData.append('password', data.password)
		if (data.avatar instanceof FileList && data.avatar[0]) {
			formData.append('avatar', data.avatar[0])
		}

		await updateProfile(formData, {
			onSuccess: () => {
				refreshUser()
			}
		})
	}

	if (isLoading) {
		return (
			<div className='text-center text-slate-500 py-10'>
				Загрузка профиля...
			</div>
		)
	}

	return (
		<div className='py-6 px-8 w-full'>
			<h2 className='text-xl font-semibold text-blue-600 mb-6'>
				Профиль пользователя
			</h2>

			<div className='bg-white border-2 border-slate-200 shadow-sm rounded-xl p-6 max-w-7xl transition-all'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-5'
				>
					{/* Аватар */}
					<div className='flex items-center gap-5'>
						<div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden shrink-0'>
							{avatarPreview ? (
								<img
									src={avatarPreview || undefined}
									alt='avatar'
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='flex items-center justify-center h-full text-gray-400 text-sm'>
									Нет фото
								</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-semibold mb-1'>
								Изменить фото
							</label>
							<input
								type='file'
								accept='image/*'
								{...register('avatar')}
								className='block text-sm text-gray-600 cursor-pointer
									file:mr-3 file:py-2 file:px-4
									file:rounded-lg file:border-0
									file:text-sm file:font-semibold
									file:bg-blue-50 file:text-blue-600
									hover:file:bg-blue-100 transition'
							/>
						</div>
					</div>

					{/* Основные поля */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5'>
						<div>
							<label className='block text-sm font-semibold mb-1'>Имя</label>
							<Field {...register('name')} />
						</div>

						<div>
							<label className='block text-sm font-semibold mb-1'>Email</label>
							<Field
								{...register('email')}
								type='email'
							/>
						</div>

						<div>
							<label className='block text-sm font-semibold mb-1'>
								Новый пароль
							</label>
							<Field
								{...register('password')}
								type='password'
							/>
						</div>

						{/* Часовой пояс */}
						<div>
							<label className='block text-sm font-semibold mb-1'>
								Часовой пояс
							</label>
							<SelectComponent
								options={TIMEZONE_OPTIONS}
								selectedValue={timezone}
								onChange={handleTimezoneChange}
								placeholder='Выберите часовой пояс'
								className='h-[45px]'
								disabled={isSavingTimezone}
							/>
							{isSavingTimezone && (
								<p className='text-xs text-slate-500 mt-1'>
									Сохраняем часовой пояс...
								</p>
							)}
						</div>
					</div>

					{user?.created_at && (
						<p className='text-sm text-slate-500 mt-6'>
							Дата регистрации: {formatDateForCard(user.created_at)}
						</p>
					)}

					<Button
						type='submit'
						className='w-full sm:w-auto sm:px-10'
						disabled={isPending}
					>
						{isPending ? 'Сохраняем...' : 'Сохранить изменения'}
					</Button>
				</form>
			</div>
		</div>
	)
}
