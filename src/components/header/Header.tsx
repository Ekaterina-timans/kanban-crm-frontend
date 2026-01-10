import { useAuth } from '@/providers/AuthProvider'

import { DASHBOARD_PAGES } from '@/config/page.url.config'

import { useGroupInvitationsModal } from '@/store/useGroupInvitationsModal'

import { InvitationsGroupModal } from '../groups/group-invitations/InvitationsGroupModal'
import { ThemeToggle } from '../theme/ThemeToggle'

import { Avatar } from './avatar/Avatar'
import { MenuItem } from './menu/MenuItem'
import { MENU } from './menu/menu.data'
import { NotificationBell } from './notifications/NotificationBell'

export function Header() {
	const { currentGroupRole } = useAuth()
	const { isOpen, defaultTab, close } = useGroupInvitationsModal()

	const menuItems = MENU.filter(item => {
		if (item.link === DASHBOARD_PAGES.ADMIN_PANEL) {
			return currentGroupRole === 'admin'
		}
		return true
	})

	return (
		<header className='h-20 bg-card border-b shadow-sm'>
			<div className='h-full w-full flex items-center justify-between px-6'>
				<div className='flex items-center gap-10'>
					<div className='text-2xl font-semibold tracking-tight'>
						<span className='bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent'>
							Flow
						</span>
						<span className='bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent'>
							Desk
						</span>
					</div>
					<nav className='flex items-center gap-2'>
						{menuItems.map(item => (
							<MenuItem
								item={item}
								key={item.link}
							/>
						))}
					</nav>
				</div>
				<div className='flex items-center gap-4'>
					<ThemeToggle />
					<NotificationBell />
					<Avatar />
				</div>

				<InvitationsGroupModal
					isOpen={isOpen}
					onClose={close}
					defaultTab={defaultTab}
				/>
			</div>
		</header>
	)
}
