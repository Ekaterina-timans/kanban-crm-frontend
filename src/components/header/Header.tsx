import { useGroupInvitationsModal } from '@/store/useGroupInvitationsModal'

import { InvitationsGroupModal } from '../groups/group-invitations/InvitationsGroupModal'

import { Avatar } from './avatar/Avatar'
import { MenuItem } from './menu/MenuItem'
import { MENU } from './menu/menu.data'
import { NotificationBell } from './notifications/NotificationBell'

export function Header() {
	const { isOpen, defaultTab, close } = useGroupInvitationsModal()

	return (
		<header className='h-20 bg-[#E0F2FE] flex items-center justify-between px-20'>
			<div className='flex space-x-0'>
				{MENU.map(item => (
					<MenuItem
						item={item}
						key={item.link}
					/>
				))}
			</div>
			<div className='flex gap-3'>
				<NotificationBell />
				<Avatar />
			</div>

			<InvitationsGroupModal
				isOpen={isOpen}
				onClose={close}
				defaultTab={defaultTab}
			/>
		</header>
	)
}
