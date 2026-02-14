'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { MainChat } from '@/components/chats/chat/MainChat'
import { SidebarChat } from '@/components/chats/sidebar/SidebarChat'
import { MainTelegram } from '@/components/telegram/MainTelegram'
import { SidebarTelegram } from '@/components/telegram/SidebarTelegram'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '@/providers/AuthProvider'

import { useChatSidebar } from '@/store/useChatSidebar'
import { useSelectedChat } from '@/store/useSelectedChat'

import { useGroupChannels } from '@/hooks/integrations/useGroupChannels'

const SIDEBAR_W = 350
type ChatSource = 'app' | 'telegram'

export function Chats() {
	const { collapsed } = useChatSidebar()

	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const { currentGroupId } = useAuth()
	const { selectedChatId, selectChat } = useSelectedChat()

	// источник чатов
	const source = (searchParams.get('source') as ChatSource) || 'app'

	// --- Telegram channel (provider=telegram) ---
	const { channels } = useGroupChannels(currentGroupId!)
	const telegramChannel = useMemo(
		() => channels?.find(c => c.provider === 'telegram') ?? null,
		[channels]
	)

	// выбранный threadId берём из URL
	const threadId = searchParams.get('threadId')

	useEffect(() => {
		if (source !== 'telegram') return
		if (telegramChannel) return

		const params = new URLSearchParams(searchParams.toString())
		params.set('source', 'app')
		params.delete('threadId')
		router.replace(`${pathname}?${params.toString()}`)
	}, [source, telegramChannel, searchParams, router, pathname])

	// синхронизация выбранного app-чата по chatId из URL
	useEffect(() => {
		if (source !== 'app') return

		const chatIdFromUrl = searchParams.get('chatId')
		if (!chatIdFromUrl) return

		if (String(selectedChatId) !== String(chatIdFromUrl)) {
			selectChat(String(chatIdFromUrl))
		}
	}, [source, searchParams, selectedChatId, selectChat])

	const gridCols = useMemo(
		() => `${collapsed ? '0px' : `${SIDEBAR_W}px`} 1fr`,
		[collapsed]
	)

	const setSource = (next: ChatSource) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('source', next)

		// чистим параметры другой вкладки
		if (next === 'app') {
			params.delete('threadId')
		} else {
			params.delete('chatId')
		}

		router.replace(`${pathname}?${params.toString()}`)
	}

	const selectThread = (id: string | number) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('source', 'telegram')
		params.set('threadId', String(id))
		// на всякий: чтобы app-чат не мешал
		params.delete('chatId')

		router.replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div
			className='grid'
			style={{ gridTemplateColumns: gridCols, height: 'calc(100vh - 80px)' }}
		>
			{/* Sidebar */}
			<aside className='h-full bg-card border-r border-border overflow-hidden flex flex-col'>
				{telegramChannel ? (
					<div className='px-3 pt-3'>
						<Tabs
							value={source}
							onValueChange={v => setSource(v as ChatSource)}
						>
							<TabsList className='w-full'>
								<TabsTrigger
									className='flex-1'
									value='app'
								>
									Чаты
								</TabsTrigger>
								<TabsTrigger
									className='flex-1'
									value='telegram'
								>
									Telegram
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				) : null}

				<div className='min-h-0 flex-1'>
					{source === 'app' ? (
						<SidebarChat />
					) : telegramChannel ? (
						<SidebarTelegram
							groupId={currentGroupId!}
							channelId={telegramChannel.id}
							selectedThreadId={threadId}
							onSelectThread={selectThread}
						/>
					) : null}
				</div>
			</aside>

			{/* Main */}
			<main className='h-full'>
				{source === 'app' ? (
					<MainChat />
				) : telegramChannel ? (
					<MainTelegram
						groupId={currentGroupId!}
						channelId={telegramChannel.id}
						threadId={threadId}
					/>
				) : (
					<div className='p-3 text-sm text-muted-foreground'>
						Telegram не подключён: создайте интеграцию и подключите токен
					</div>
				)}
			</main>
		</div>
	)
}
