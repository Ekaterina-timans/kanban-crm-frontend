'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { useAuth } from '@/providers/AuthProvider'

import { useConnectTelegram } from '@/hooks/integrations/useConnectTelegram'
import { useCreateTelegramChannel } from '@/hooks/integrations/useCreateTelegramChannel'
import { useDisconnectTelegram } from '@/hooks/integrations/useDisconnectTelegram'
import { useGroupChannels } from '@/hooks/integrations/useGroupChannels'

export function IntegrationSection() {
	const { currentGroupId } = useAuth()

	const [showConnect, setShowConnect] = useState(false)
	const [botToken, setBotToken] = useState('')

	const { channels, isLoading, error } = useGroupChannels(currentGroupId!)
	const { createTelegram, isPending: isCreating } = useCreateTelegramChannel(
		currentGroupId!
	)
	const { connectTelegram, isPending: isConnecting } = useConnectTelegram(
		currentGroupId!
	)
	const { disconnectTelegram, isPending: isDisconnecting } =
		useDisconnectTelegram(currentGroupId!)

	const telegram = useMemo(
		() => channels?.find(c => c.provider === 'telegram') ?? null,
		[channels]
	)

	const tgSettings: any = telegram?.settings?.telegram ?? {}

	if (!currentGroupId) {
		return <div className='text-slate-600'>Группа не выбрана</div>
	}

	if (isLoading) return <div className='text-slate-600'>Загрузка…</div>
	if (error)
		return <div className='text-red-600'>Не удалось загрузить интеграции</div>

	const canShowConnect =
		!!telegram && (telegram.status !== 'active' || showConnect)

	return (
		<div className='space-y-4 max-w-2xl'>
			<h3 className='text-xl font-semibold text-blue-600'>Интеграции</h3>

			{/* Карточка Telegram */}
			<div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3'>
				<div className='flex items-start justify-between gap-3'>
					<div>
						<div className='text-lg font-semibold'>Telegram</div>
						<p className='text-sm text-slate-600 mt-1'>
							Подключите Telegram-бота к этой группе, чтобы получать диалоги и
							отвечать из панели.
						</p>
					</div>

					{!telegram && (
						<Button
							variant='default'
							onClick={async () => {
								try {
									await createTelegram()
									toast.success('Интеграция Telegram создана')
								} catch (e: any) {
									toast.error(e?.message ?? 'Ошибка создания интеграции')
								}
							}}
							disabled={isCreating}
						>
							{isCreating ? 'Создание…' : 'Создать'}
						</Button>
					)}
				</div>

				{telegram ? (
					<div className='text-sm'>
						<div className='flex items-center gap-2'>
							<span className='text-slate-600'>Статус:</span>
							<span
								className={
									telegram.status === 'active'
										? 'text-green-600 font-medium'
										: telegram.status === 'error'
											? 'text-red-600 font-medium'
											: 'text-slate-700 font-medium'
								}
							>
								{telegram.status}
							</span>
						</div>

						<div className='flex items-center gap-2 mt-1'>
							<span className='text-slate-600'>Название:</span>
							<span className='text-slate-900 font-medium'>
								{telegram.display_name}
							</span>
						</div>

						{telegram.status === 'error' && (
							<div className='mt-2 text-sm text-red-600'>
								Токен неверный/устарел — переподключите
								бота.
							</div>
						)}
					</div>
				) : (
					<p className='text-sm text-slate-600'>
						Сначала создайте интеграцию, затем подключите токен бота.
					</p>
				)}
			</div>

			{/* Форма подключения/переподключения */}
			{canShowConnect && (
				<div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3'>
					<h4 className='font-semibold'>
						{telegram?.status === 'active'
							? 'Смена токена'
							: 'Подключение Telegram-бота'}
					</h4>

					<p className='text-sm text-slate-600'>
						Создайте бота в <span className='font-medium'>@BotFather</span>,
						скопируйте токен и вставьте сюда.
					</p>

					<Field
						label='Bot token'
						placeholder='123456:ABCDEF...'
						value={botToken}
						onChange={e => setBotToken((e.target as HTMLInputElement).value)}
					/>

					<div className='flex gap-2'>
						<Button
							variant='default'
							onClick={async () => {
								if (!telegram) return
								if (!botToken.trim()) {
									toast.error('Вставьте токен')
									return
								}
								try {
									await connectTelegram({
										channelId: telegram.id,
										bot_token: botToken.trim()
									})
									setBotToken('')
									setShowConnect(false)
									toast.success('Telegram подключён')
								} catch (e: any) {
									toast.error(e?.message ?? 'Не удалось подключить Telegram')
								}
							}}
							disabled={isConnecting}
						>
							{isConnecting ? 'Подключение…' : 'Подключить'}
						</Button>

						{telegram?.status === 'active' && (
							<Button
								variant='secondary'
								onClick={() => {
									setBotToken('')
									setShowConnect(false)
								}}
							>
								Отмена
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Бот подключён */}
			{telegram && telegram.status === 'active' && !showConnect && (
				<div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3'>
					<h4 className='font-semibold'>Бот подключён</h4>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
						<div className='border rounded-lg p-3'>
							<div className='text-slate-500 text-xs'>Username</div>
							<div className='font-medium'>
								{tgSettings?.bot_username ? `@${tgSettings.bot_username}` : '—'}
							</div>
						</div>

						<div className='border rounded-lg p-3'>
							<div className='text-slate-500 text-xs'>Name</div>
							<div className='font-medium'>{tgSettings?.bot_name ?? '—'}</div>
						</div>
					</div>

					<div className='flex gap-2'>
						<Button
							variant='secondary'
							onClick={() => setShowConnect(true)}
						>
							Сменить токен
						</Button>

						<Button
							variant='destructive'
							onClick={async () => {
								const yes = confirm('Отключить Telegram-бота от группы?')
								if (!yes) return

								try {
									await disconnectTelegram({ channelId: telegram.id })
									toast.success('Telegram отключён')
								} catch (e: any) {
									toast.error(e?.message ?? 'Не удалось отключить Telegram')
								}
							}}
							disabled={isDisconnecting}
						>
							{isDisconnecting ? 'Отключение…' : 'Отключить'}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
