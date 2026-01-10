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
						<span className='font-medium text-foreground text-sm'>
							{user.name}
						</span>
						<span className='text-muted-foreground text-xs'>{user.email}</span>
					</div>
				</div>
			}
		>
			<span
				className={[
					'mention',
					'font-medium cursor-pointer',
					'transition-opacity duration-150',
					'hover:underline'
				].join(' ')}
			>
				@{displayName}
			</span>
		</Tooltip>
	)
}
