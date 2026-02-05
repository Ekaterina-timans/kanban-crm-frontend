'use client'

import { useEffect, useMemo, useState } from 'react'

import { SettingRow } from '@/components/notifications/SettingRow'
import {
	NotificationSettingsForm,
	mapSettingsToForm
} from '@/components/notifications/mapSettingsToForm'
import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { useNotificationSettings } from '@/hooks/notification/useNotificationSettings'

export function NotificationSettings() {
	const { query, mutation } = useNotificationSettings()

	const initial = useMemo<NotificationSettingsForm | null>(() => {
		if (!query.data) return null
		return mapSettingsToForm(query.data)
	}, [query.data])

	const [form, setForm] = useState<NotificationSettingsForm | null>(null)

	useEffect(() => {
		if (initial) setForm(initial)
	}, [initial])

	const setBool =
		(key: keyof NotificationSettingsForm) => (checked: boolean) => {
			setForm(prev => (prev ? { ...prev, [key]: checked } : prev))
		}

	const onSave = () => {
		if (!form) return
		mutation.mutate(form)
	}

	if (query.isLoading || !form) {
		return <div className='p-6'>Загрузка...</div>
	}

	const deadlineDisabled = !form.inapp_deadline_reminders

	return (
		<div className='mx-auto w-full max-w-5xl px-4 py-6 sm:px-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-semibold'>Настройки уведомлений</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Выберите, какие уведомления вы хотите получать.
				</p>
			</div>

			{/* 2 колонки на lg, 1 колонка на мобиле */}
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
				{/* PUSH FIRST */}
				<section className='rounded-2xl border bg-card p-5 shadow-sm'>
					<div className='mb-4'>
						<h2 className='text-lg font-semibold'>Push-уведомления</h2>
						<p className='text-sm text-muted-foreground'>
							Уведомления в приложении (колокольчик).
						</p>
					</div>

					<div className='divide-y'>
						<SettingRow
							label='Приглашения в группу'
							checked
							onCheckedChange={() => {}}
							disabled
							hint='Всегда включено'
						/>

						<SettingRow
							label='Новые сообщения'
							checked={form.inapp_chat_messages}
							onCheckedChange={setBool('inapp_chat_messages')}
						/>
						<SettingRow
							label='Упоминания'
							checked={form.inapp_mentions}
							onCheckedChange={setBool('inapp_mentions')}
						/>
						<SettingRow
							label='Назначили на задачу'
							checked={form.inapp_task_assigned}
							onCheckedChange={setBool('inapp_task_assigned')}
						/>
						<SettingRow
							label='Комментарии к моим задачам'
							checked={form.inapp_comments_on_my_tasks}
							onCheckedChange={setBool('inapp_comments_on_my_tasks')}
						/>
						<SettingRow
							label='Комментарии к задачам, где я ответственная'
							checked={form.inapp_comments_on_assigned_tasks}
							onCheckedChange={setBool('inapp_comments_on_assigned_tasks')}
						/>
						<SettingRow
							label='Напоминания о дедлайнах'
							checked={form.inapp_deadline_reminders}
							onCheckedChange={setBool('inapp_deadline_reminders')}
							hint='Будут приходить в выбранное время'
						/>
					</div>

					{/* deadline extras */}
					<div className='mt-4 rounded-xl border bg-background p-4'>
						<div className='mb-3'>
							<div className='text-sm font-medium'>Параметры дедлайнов</div>
							<div className='text-xs text-muted-foreground'>
								Настройки применяются только если включены напоминания о
								дедлайнах.
							</div>
						</div>

						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<Field
								label='За сколько дней'
								type='number'
								min={0}
								max={30}
								disabled={deadlineDisabled}
								value={String(form.deadline_days_before)}
								onChange={e => {
									const v = Number(e.target.value || 0)
									const safe = Math.max(0, Math.min(30, v))
									setForm(prev =>
										prev ? { ...prev, deadline_days_before: safe } : prev
									)
								}}
							/>

							<Field
								label='Время уведомления'
								type='time'
								disabled={deadlineDisabled}
								value={form.deadline_notify_time}
								onChange={e =>
									setForm(prev =>
										prev
											? { ...prev, deadline_notify_time: e.target.value }
											: prev
									)
								}
							/>
						</div>
					</div>
				</section>

				{/* EMAIL SECOND */}
				<section className='rounded-2xl border bg-card p-5 shadow-sm'>
					<div className='mb-4'>
						<h2 className='text-lg font-semibold'>Email-уведомления</h2>
						<p className='text-sm text-muted-foreground'>
							Письма на почту (можно выключить всё).
						</p>
					</div>

					<div className='divide-y'>
						<SettingRow
							label='Новые сообщения в чатах'
							checked={form.email_chat_messages}
							onCheckedChange={setBool('email_chat_messages')}
						/>
						<SettingRow
							label='Назначение на задачу'
							checked={form.email_task_assigned}
							onCheckedChange={setBool('email_task_assigned')}
						/>
						<SettingRow
							label='Комментарии к моим задачам'
							checked={form.email_comments_on_my_tasks}
							onCheckedChange={setBool('email_comments_on_my_tasks')}
						/>
						<SettingRow
							label='Комментарии к задачам, где я ответственная'
							checked={form.email_comments_on_assigned_tasks}
							onCheckedChange={setBool('email_comments_on_assigned_tasks')}
						/>
						<SettingRow
							label='Напоминания о дедлайнах'
							checked={form.email_deadline_reminders}
							onCheckedChange={setBool('email_deadline_reminders')}
						/>
					</div>

					{/* подсказка */}
					<div className='mt-4 rounded-xl bg-background p-4 text-sm text-muted-foreground'>
						Если включить Email-дедлайны, письма будут приходить по тем же
						параметрам «за сколько дней» и «время», что и для push.
					</div>
				</section>
			</div>

			<div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
				<Button
					className='sm:w-auto'
					onClick={onSave}
					disabled={mutation.isPending}
				>
					{mutation.isPending ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	)
}