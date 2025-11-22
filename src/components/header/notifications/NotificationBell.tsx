'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

import Badge from '@/components/ui/badge/Badge'

import { useNotifications } from '@/hooks/notification/useNotifications'

import { NotificationsDropdown } from './NotificationsDropdown'

export function NotificationBell() {
	const [open, setOpen] = useState(false)
	const { data: notifications = [] } = useNotifications()

	// Только непрочитанные
	const unreadCount = notifications.filter(n => !n.read_at).length

	return (
		<div className='relative'>
			<button
				className='relative'
				onClick={() => setOpen(v => !v)}
				aria-label='Открыть уведомления'
			>
				<Bell className='w-7 h-7' />
				{unreadCount > 0 && (
					<span className='absolute -top-2 -right-4'>
						<Badge
							text={String(unreadCount)}
							color='danger'
							size='small'
						/>
					</span>
				)}
			</button>
			{open && (
				<NotificationsDropdown
					notifications={notifications}
					onClose={() => setOpen(false)}
				/>
			)}
		</div>
	)
}
