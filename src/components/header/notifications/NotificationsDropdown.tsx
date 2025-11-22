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

export function NotificationsDropdown({
	notifications,
	onClose
}: NotificationProps) {
	const markRead = useMarkNotificationsRead()

	const handleClearAll = () => {
		markRead.mutate()
		onClose()
	}

	return (
		<div className='absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 p-4 border'>
			<div className='flex justify-between items-center mb-2'>
				<span className='font-bold text-lg'>Уведомления</span>
				<button onClick={onClose}>
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

					// Если action — функция (открытие модалки), рендерим <div> с onClick
					if (typeof action === 'function') {
						return (
							<div
								key={n.id}
								className='block hover:bg-gray-100 rounded p-2 mb-1 transition cursor-pointer'
								onClick={() => action(n, onClose)}
							>
								<div className='flex items-start space-x-2'>
									<span className='inline-block bg-gray-200 p-2 rounded-full'>
										<Badge
											text='!'
											color='primary'
										/>
									</span>
									<div className='flex-1'>
										<div className='font-semibold'>{title}</div>
										{description && (
											<div className='text-xs text-gray-500'>{description}</div>
										)}
										<div className='text-xs text-gray-400 mt-1'>
											{new Date(n.created_at).toLocaleString('ru-RU')}
										</div>
									</div>
								</div>
							</div>
						)
					}
					// Если action — ссылка, рендерим <Link>
					if (typeof action === 'string' && action.length > 0) {
						return (
							<Link
								key={n.id}
								href={action}
								className='block hover:bg-gray-100 rounded p-2 mb-1 transition'
								onClick={onClose}
							>
								<div className='flex items-start space-x-2'>
									<span className='inline-block bg-gray-200 p-2 rounded-full'>
										<Badge
											text='!'
											color='primary'
										/>
									</span>
									<div className='flex-1'>
										<div className='font-semibold'>{title}</div>
										{description && (
											<div className='text-xs text-gray-500'>{description}</div>
										)}
										<div className='text-xs text-gray-400 mt-1'>
											{new Date(n.created_at).toLocaleString('ru-RU')}
										</div>
									</div>
								</div>
							</Link>
						)
					}
					// Если action пустой (дефолт), просто <div> без onClick
					return (
						<div
							key={n.id}
							className='block hover:bg-gray-100 rounded p-2 mb-1 transition'
						>
							<div className='flex items-start space-x-2'>
								<span className='inline-block bg-gray-200 p-2 rounded-full'>
									<Badge
										text='!'
										color='primary'
									/>
								</span>
								<div className='flex-1'>
									<div className='font-semibold'>{title}</div>
									{description && (
										<div className='text-xs text-gray-500'>{description}</div>
									)}
									<div className='text-xs text-gray-400 mt-1'>
										{new Date(n.created_at).toLocaleString('ru-RU')}
									</div>
								</div>
							</div>
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
