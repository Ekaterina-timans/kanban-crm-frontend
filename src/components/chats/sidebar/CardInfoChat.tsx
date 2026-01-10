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
				'flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-colors',
				'border bg-white dark:bg-card',
				!isSelected &&
					'border-slate-200 hover:bg-[#E0F2FE] hover:border-slate-300 ' +
						'dark:border-border dark:hover:bg-accent/40 dark:hover:border-border',
				isSelected &&
					'border-blue-400 ring-2 ring-blue-200 bg-white ' +
						'dark:border-primary dark:ring-2 dark:ring-primary/20 dark:bg-card'
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

				<div className='flex flex-col overflow-hidden min-w-0'>
					<span className='font-semibold text-base text-foreground truncate'>
						{chat.title}
					</span>
					<span className='text-sm text-muted-foreground truncate'>
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
