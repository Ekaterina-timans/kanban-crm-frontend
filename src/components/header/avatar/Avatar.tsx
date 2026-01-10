import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import {
	DropdownMenu,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'

import { useAuth } from '@/providers/AuthProvider'

import { MenuProfile } from './menu-profile/MenuProfile'

export function Avatar() {
	const { user } = useAuth()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					className='rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
				>
					<UserAvatar
						src={user?.avatar}
						name={user?.name ?? null}
						email={user?.email}
						size={65}
						className='cursor-pointer hover:scale-105 transition-transform'
						fallbackClassName='font-semibold text-4xl bg-primary/15 text-primary'
					/>
				</button>
			</DropdownMenuTrigger>
			<MenuProfile />
		</DropdownMenu>
	)
}
