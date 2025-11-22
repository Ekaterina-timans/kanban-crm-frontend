import { forwardRef } from 'react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/components/ui/avatar/avatar'

import { getPublicUrl } from '@/utils/getPublicUrl'

import { cn } from '@/lib/utils'

interface UserAvatarProps {
	src?: string | FileList | null
	name?: string | null
	email?: string
	size?: number
	className?: string
  fallbackClassName?: string
}

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
	({ src, name, email, size = 40, className, fallbackClassName }, ref) => {
		const avatarUrl = typeof src === 'string' ? getPublicUrl(src) : null
		const initial =
			name?.trim()?.charAt(0)?.toUpperCase() ??
			email?.trim()?.charAt(0)?.toUpperCase() ??
			'?'

		return (
			<Avatar
				ref={ref}
				className={cn(
					'bg-slate-200 border border-slate-300 overflow-hidden',
					className
				)}
				style={{ width: size, height: size }}
			>
				{avatarUrl && (
					<AvatarImage
						src={avatarUrl}
						alt={name || email || 'User'}
						className='object-cover'
					/>
				)}
				<AvatarFallback className={cn('bg-blue-100 text-blue-600 text-sm font-medium', fallbackClassName)}>
					{initial}
				</AvatarFallback>
			</Avatar>
		)
	}
)

UserAvatar.displayName = 'UserAvatar'
