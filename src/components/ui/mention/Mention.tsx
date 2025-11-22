import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { UserAvatar } from '../avatar/UserAvatar'

export function Mention({ user }: { user: any }) {
	const displayName = user.name || user.email || 'Пользователь'

	return (
		<Tooltip
			content={
				<div className='flex items-center gap-2'>
					<UserAvatar
						src={user.avatar}
						name={user.name ?? null}
						email={user.email}
						size={24}
						className='h-6 w-6 border border-gray-300'
						fallbackClassName='text-black text-xs font-medium'
					/>
					<div className='flex flex-col'>
						<span className='font-medium text-white text-sm'>{user.name}</span>
						<span className='text-gray-300 text-xs'>{user.email}</span>
					</div>
				</div>
			}
		>
			<span className='text-blue-600 font-medium cursor-pointer hover:underline hover:text-blue-700 transition-colors duration-100'>
				@{displayName}
			</span>
		</Tooltip>
	)
}
