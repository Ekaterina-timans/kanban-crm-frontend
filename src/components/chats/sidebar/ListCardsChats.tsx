'use client'

import { useMemo } from 'react'

import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { useAuth } from '@/providers/AuthProvider'

import { useSelectedChat } from '@/store/useSelectedChat'

import { useChatsLiveUpdates } from '@/hooks/chat/useChatsLiveUpdates'
import { useGroupChats } from '@/hooks/chat/useGroupChats'
import { useMarkChatRead } from '@/hooks/message/useMarkChatRead'

import { CardInfoChat } from './CardInfoChat'

export function ListCardsChats({ search = '' }: { search?: string }) {
	const { currentGroupId } = useAuth()
	const { chats, isLoading } = useGroupChats(currentGroupId, true)
	const { selectedChatId, selectChat } = useSelectedChat()
	const markRead = useMarkChatRead(currentGroupId)

	useChatsLiveUpdates({ groupId: currentGroupId, chats, selectedChatId })

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		if (!q) return chats
		return chats.filter(c => c.title.toLowerCase().includes(q))
	}, [chats, search])

	return (
		<ScrollArea className='h-[80%] my-4 w-full'>
			<div className='w-[95%] px-0.5'>
				{isLoading && (
					<div className='text-sm text-muted-foreground p-2'>Загрузка…</div>
				)}
				{!isLoading && filtered.length === 0 && <></>}
				{!isLoading &&
					filtered.map(chat => (
						<CardInfoChat
							key={chat.id}
							chat={chat}
							isSelected={String(selectedChatId) === String(chat.id)}
							onClick={() => {
								selectChat(chat.id)
								if (chat.last_message_id) {
									markRead.mutate({
										chatId: chat.id,
										lastId: chat.last_message_id
									})
								}
							}}
						/>
					))}
			</div>
		</ScrollArea>
	)
}
