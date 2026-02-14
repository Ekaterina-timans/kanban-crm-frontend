'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Badge from '@/components/ui/badge/Badge'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

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
	const router = useRouter()

	const handleClearAll = () => {
		markRead.mutate()
		onClose()
	}

	const itemClass =
		'block rounded p-2 mb-1 transition hover:bg-accent hover:text-accent-foreground'

	return (
		<div className='absolute right-0 mt-2 w-96 rounded-lg border border-border bg-card text-card-foreground shadow-lg z-50 p-4'>
			<div className='flex justify-between items-center mb-2'>
				<span className='font-bold text-lg'>Уведомления</span>

				<button
					onClick={onClose}
					aria-label='Закрыть'
					className='rounded-md p-1 hover:bg-accent hover:text-accent-foreground transition'
				>
					<X className='h-5 w-5' />
				</button>
			</div>

			<ScrollArea className='h-80'>
				<div className='pr-2'>
					{notifications.length === 0 && (
						<div className='text-sm py-4 text-center text-muted-foreground'>
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
							<div className='text-xs text-muted-foreground mt-1'>
								{new Date(n.created_at).toLocaleString('ru-RU')}
							</div>
						)

						const Content = (
							<div className='flex items-start gap-2'>
								<span className='inline-flex items-center justify-center rounded-full bg-muted p-2'>
									<Badge
										text='!'
										color='primary'
									/>
								</span>

								<div className='flex-1'>
									<div className='font-semibold'>{title}</div>
									{description && (
										<div className='text-xs text-muted-foreground'>
											{description}
										</div>
									)}
									{DateLine}
								</div>
							</div>
						)

						// 1) action строка => Link
						if (typeof action === 'string' && action.length > 0) {
							return (
								<Link
									key={n.id}
									href={action}
									className={itemClass}
									onClick={onClose}
								>
									{Content}
								</Link>
							)
						}

						// 2) action функция => ТОЛЬКО onClick (без вызовов в рендере)
						if (typeof action === 'function') {
							return (
								<div
									key={n.id}
									className={`${itemClass} cursor-pointer`}
									role='button'
									tabIndex={0}
									onClick={() => {
										const res = action(n, onClose)

										// если функция вернула строку — считаем это href и навигируем вручную
										if (typeof res === 'string' && res.length > 0) {
											router.push(res)
											onClose()
										}
									}}
									onKeyDown={e => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											const res = action(n, onClose)
											if (typeof res === 'string' && res.length > 0) {
												router.push(res)
												onClose()
											}
										}
									}}
								>
									{Content}
								</div>
							)
						}

						// 3) дефолт
						return (
							<div
								key={n.id}
								className={itemClass}
							>
								{Content}
							</div>
						)
					})}
				</div>
			</ScrollArea>

			<button
				className='w-full mt-4 py-2 rounded bg-destructive text-destructive-foreground hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed'
				onClick={handleClearAll}
				disabled={markRead.isPending}
			>
				Очистить все
			</button>
		</div>
	)
}
