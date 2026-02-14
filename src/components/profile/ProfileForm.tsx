'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { ProfileFormProps, ProfileFormValues } from '@/types/profile.types'

import { TIMEZONE_OPTIONS } from '@/config/timezones.constants'

import { useTimezoneStore } from '@/store/useTimezoneStore'

import { formatDateForCard } from '@/utils/date-utils'
import { getPublicUrl } from '@/utils/getPublicUrl'

import { userPreferencesService } from '@/services/user-preferences.service'

export function ProfileForm({
	title,
	user,
	isLoading,
	isPending,
	onSubmit
}: ProfileFormProps) {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [isSavingTimezone, setSavingTimezone] = useState(false)

	const { timezone, setTimezone } = useTimezoneStore()

	const { register, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			avatar: null
		}
	})

	const avatarFile = watch('avatar')

	useEffect(() => {
		if (!user) return

		reset({
			name: user.name ?? '',
			email: user.email ?? '',
			password: '',
			avatar: null
		})

		if (typeof user.avatar === 'string' && user.avatar.length > 0) {
			setAvatarPreview(getPublicUrl(user.avatar))
		} else {
			setAvatarPreview(null)
		}
	}, [user, reset])

	useEffect(() => {
		const file = avatarFile instanceof FileList ? avatarFile[0] : null
		if (!file) return

		const reader = new FileReader()
		reader.onload = () => setAvatarPreview(reader.result as string)
		reader.readAsDataURL(file)
	}, [avatarFile])

	const handleTimezoneChange = async (value: string) => {
		setTimezone(value)
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

	const submitHandler = async (data: ProfileFormValues) => {
		try {
			const formData = new FormData()
			formData.append('name', data.name || '')
			formData.append('email', data.email)

			if (data.password) {
				formData.append('password', data.password)
			}

			if (data.avatar instanceof FileList && data.avatar[0]) {
				formData.append('avatar', data.avatar[0])
			}

			await onSubmit(formData)
		} catch {
			toast.error('Ошибка при сохранении профиля')
		}
	}

	if (isLoading) {
		return (
			<div className='text-center text-muted-foreground py-10'>
				Загрузка профиля...
			</div>
		)
	}

	return (
		<div className='py-6 px-8 w-full'>
			<h2 className='text-xl font-semibold text-primary mb-6'>{title}</h2>

			<div className='bg-card text-card-foreground border border-border shadow-sm rounded-xl p-6 max-w-7xl transition-all'>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className='space-y-5'
				>
					<div className='flex items-center gap-5'>
						<div className='w-24 h-24 rounded-full bg-muted overflow-hidden shrink-0'>
							{avatarPreview ? (
								<img
									src={avatarPreview || undefined}
									alt='avatar'
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='flex items-center justify-center h-full text-muted-foreground text-sm'>
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
								className='block text-sm text-muted-foreground cursor-pointer
									file:mr-3 file:py-2 file:px-4
									file:rounded-lg file:border-0
									file:text-sm file:font-semibold
									file:bg-secondary file:text-primary
									hover:file:opacity-90 transition'
							/>
						</div>
					</div>

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
								<p className='text-xs text-muted-foreground mt-1'>
									Сохраняем часовой пояс...
								</p>
							)}
						</div>
					</div>

					{user?.created_at && (
						<p className='text-sm text-muted-foreground mt-6'>
							Дата регистрации: {formatDateForCard(user.created_at)}
						</p>
					)}

					<Button
						variant='default'
						type='submit'
						className='w-full sm:w-auto sm:px-10'
						disabled={!!isPending}
					>
						{isPending ? 'Сохраняем...' : 'Сохранить изменения'}
					</Button>
				</form>
			</div>
		</div>
	)
}
