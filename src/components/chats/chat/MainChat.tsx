import { useSelectedChat } from '@/store/useSelectedChat'

import { useChat } from '@/hooks/chat/useChat'
import { useChatMessages } from '@/hooks/chat/useChatMessages'
import { useMyChatRole } from '@/hooks/chat/useMyChatRole'

import { MessageComposer } from './footer/MessageComposer'
import { HeaderChat } from './header/HeaderChat'
import { MessagesList } from './messages/MessagesList'

export function MainChat() {
	const { selectedChatId } = useSelectedChat()
	const { chat, isLoading: isChatLoading } = useChat(selectedChatId)
	const {
		messages,
		hasOlder,
		loadOlder,
		isLoading: isMsgsLoading
	} = useChatMessages(selectedChatId)
	const { role, permissions, isLoading: isRoleLoading } = useMyChatRole(selectedChatId, chat?.type)

	if (!selectedChatId)
		return (
			<div className='flex items-center justify-center flex-1'>
				Чат не выбран
			</div>
		)
	if (isChatLoading)
		return (
			<div className='flex items-center justify-center flex-1'>
				Загрузка чата…
			</div>
		)
	if (!chat)
		return (
			<div className='flex items-center justify-center flex-1'>
				Чат не найден
			</div>
		)

	const participantsCount =
		chat?.type === 'group' ? chat?.participants_count : undefined

	return (
		<div
			className='flex flex-col'
			style={{ height: 'calc(100vh - 80px)' }}
		>
			<HeaderChat
				title={chat.title}
				participantsCount={participantsCount}
				chatType={chat.type}
				myRole={role}
				permissions={permissions}
			/>
			<MessagesList
				messages={messages}
				isLoading={isMsgsLoading}
				hasOlder={hasOlder}
				onLoadOlder={loadOlder}
				chatType={chat.type}
			/>
			<MessageComposer />
		</div>
	)
}
