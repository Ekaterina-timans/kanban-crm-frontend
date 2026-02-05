'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { MainChat } from '@/components/chats/chat/MainChat'
import { SidebarChat } from '@/components/chats/sidebar/SidebarChat'

import { useChatSidebar } from '@/store/useChatSidebar'
import { useSelectedChat } from '@/store/useSelectedChat'

const SIDEBAR_W = 350

export function Chats() {
	const { collapsed, toggle } = useChatSidebar()
	const searchParams = useSearchParams()
	const { selectedChatId, selectChat } = useSelectedChat()

	useEffect(() => {
		const chatIdFromUrl = searchParams.get('chatId')
		if (!chatIdFromUrl) return

		if (String(selectedChatId) !== String(chatIdFromUrl)) {
			selectChat(String(chatIdFromUrl))
		}
	}, [searchParams, selectedChatId, selectChat])

	const gridCols = useMemo(
		() => `${collapsed ? '0px' : `${SIDEBAR_W}px`} 1fr`,
		[collapsed]
	)

	const handleLeft = collapsed ? 0 : SIDEBAR_W

	return (
		<div
			className='grid'
			style={{ gridTemplateColumns: gridCols, height: 'calc(100vh - 80px)' }}
		>
			<SidebarChat />
			<MainChat />
		</div>
	)
}
