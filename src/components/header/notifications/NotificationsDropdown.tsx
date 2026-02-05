'use client'

import { X } from 'lucide-react'
import Link from 'next/link'

import Badge from '@/components/ui/badge/Badge'

import { INotification } from '@/types/notification.types'

import { useMarkNotificationsRead } from '@/hooks/notification/useNotifications'

import { notificationsConfig } from './notificationsConfig'

interface NotificationProps {
	notifications: INotification[]
	onClose: () => void
}

export function NotificationsDropdown({ notifications, onClose }: NotificationProps) {
	const markRead = useMarkNotificationsRead()

	const handleClearAll = () => {
		markRead.mutate()
		onClose()
	}

	return (
		<div className='absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 p-4 border'>
			<div className='flex justify-between items-center mb-2'>
				<span className='font-bold text-lg'>Уведомления</span>
				<button onClick={onClose} aria-label='Закрыть'>
					<X />
				</button>
			</div>

			<div className='max-h-80 overflow-y-auto'>
				{notifications.length === 0 && (
					<div className='text-gray-500 text-sm py-4 text-center'>
						Нет новых уведомлений
					</div>
				)}

				{notifications.map(n => {
					const config =
						notificationsConfig[n.type] || notificationsConfig.default

					const title = config.renderTitle(n)
					const description = config.renderDescription?.(n)
					const action = config.action

					const DateLine = (
						<div className='text-xs text-gray-400 mt-1'>
							{new Date(n.created_at).toLocaleString('ru-RU')}
						</div>
					)

					const Content = (
						<div className='flex items-start space-x-2'>
							<span className='inline-block bg-gray-200 p-2 rounded-full'>
								<Badge text='!' color='primary' />
							</span>

							<div className='flex-1'>
								<div className='font-semibold'>{title}</div>
								{description && (
									<div className='text-xs text-gray-500'>{description}</div>
								)}
								{DateLine}
							</div>
						</div>
					)

					// 1) action как строка => просто Link
					if (typeof action === 'string' && action.length > 0) {
						return (
							<Link
								key={n.id}
								href={action}
								className='block hover:bg-gray-100 rounded p-2 mb-1 transition'
								onClick={onClose}
							>
								{Content}
							</Link>
						)
					}

					// 2) action как функция:
					// может открыть модалку (side-effect) ИЛИ вернуть ссылку (href)
					if (typeof action === 'function') {
						let maybeHref: unknown = null

						try {
							// пробуем получить href
							maybeHref = action(n, () => {})
						} catch {
							maybeHref = null
						}

						// если функция вернула ссылку — делаем Link
						if (typeof maybeHref === 'string' && maybeHref.length > 0) {
							return (
								<Link
									key={n.id}
									href={maybeHref}
									className='block hover:bg-gray-100 rounded p-2 mb-1 transition'
									onClick={onClose}
								>
									{Content}
								</Link>
							)
						}

						// иначе это “кнопка” (модалка/side-effect)
						return (
							<div
								key={n.id}
								className='block hover:bg-gray-100 rounded p-2 mb-1 transition cursor-pointer'
								onClick={() => action(n, onClose)}
							>
								{Content}
							</div>
						)
					}

					// 3) дефолт — просто карточка
					return (
						<div
							key={n.id}
							className='block hover:bg-gray-100 rounded p-2 mb-1 transition'
						>
							{Content}
						</div>
					)
				})}
			</div>

			<button
				className='w-full mt-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
				onClick={handleClearAll}
				disabled={markRead.isPending}
			>
				Очистить все
			</button>
		</div>
	)
}
