import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'

import { IChat } from '@/types/chat.type'

interface CardInfoChatProps {
	chat: IChat
	isSelected?: boolean
	onClick?: () => void
}

export function CardInfoChat({
	chat,
	isSelected = false,
	onClick
}: CardInfoChatProps) {
	return (
		<div
			className={[
				'flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:bg-[#E0F2FE] cursor-pointer transition-colors',
				isSelected ? 'bg-[#E0F2FE]' : ''
			].join(' ')}
			onClick={onClick}
		>
			{/* Левая часть */}
			<div className='flex items-center flex-1 min-w-0'>
				<UserAvatar
					src={chat.avatar}
					name={chat.title ?? null}
					email={undefined}
					size={40}
					className='mr-3'
					fallbackClassName='font-semibold text-base'
				/>

				<div className='flex flex-col overflow-hidden'>
					<span className='font-semibold text-base text-gray-900 truncate'>
						{chat.title}
					</span>
					<span className='text-sm text-gray-600 truncate'>
						{chat.last_message || 'Нет сообщений'}
					</span>
				</div>
			</div>

			{/* Правая часть */}
			{!isSelected && chat.unread_count > 0 && (
				<Badge
					text={chat.unread_count > 99 ? '99+' : String(chat.unread_count)}
					color='primary'
					size='small'
					className='ml-3 flex items-center justify-center min-w-[24px] h-6'
				/>
			)}
		</div>
	)
}
