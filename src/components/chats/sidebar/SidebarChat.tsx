'use client'

import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { useSelectedChat } from '@/store/useSelectedChat'

import { useGlobalChatSearch } from '@/hooks/chat/useGlobalChatSearch'
import { useDebounced } from '@/hooks/useDebounced'

import { ChatModal } from '../ChatModal'

import { ListCardsChats } from './ListCardsChats'

export function SidebarChat() {
	const [isModalOpen, setModalOpen] = useState(false)
	const [search, setSearch] = useState('')
	const debounced = useDebounced(search, 300)
	const selectChat = useSelectedChat(s => s.selectChat)
	const hasQuery = debounced.trim().length > 0

	const { data, isFetching } = useGlobalChatSearch(debounced)

	return (
		<aside className='h-full bg-card border-r border-border overflow-hidden px-3 py-1 flex flex-col'>
			<div className='mt-3'>
				<Field
					placeholder='Поиск...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					leftIcon={Search}
					rightIcon={X}
					onRightIconClick={() => setSearch('')}
				/>
			</div>
			<Button
				variant='outline'
				className='mt-3 w-full h-10 justify-center gap-2 rounded-xl'
				onClick={() => setModalOpen(true)}
			>
				<Plus
					className='mr-2'
					size={18}
				/>
				<span className='text-sm'>Создать новый чат</span>
			</Button>
			<ScrollArea className='min-h-0 flex-1 mt-3 pr-1 overflow-x-hidden'>
				{/* Без запроса — обычный список */}
				{!hasQuery && <ListCardsChats search={search} />}

				{/* С запросом — результаты глобального поиска */}
				{hasQuery && (
					<div className='mt-3 overflow-x-hidden space-y-3'>
						<div>
							<p className='px-1 text-xs text-muted-foreground mb-1'>
								Чаты {isFetching && '…'}
							</p>
							<div className='space-y-1'>
								{(data?.chats ?? []).map(c => (
									<button
										key={c.id}
										className={[
											'w-full text-left px-3 py-2 rounded-xl transition-colors',
											'hover:bg-[#E0F2FE] dark:hover:bg-accent/40',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
										].join(' ')}
										onClick={() => selectChat(String(c.id))}
									>
										<div className='font-medium truncate min-w-0'>
											{c.title}
										</div>
										{c.last_message && (
											<div className='text-xs text-muted-foreground truncate'>
												{c.last_message}
											</div>
										)}
									</button>
								))}
								{!data?.chats?.length && (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										Нет совпадений
									</div>
								)}
							</div>
						</div>

						<div>
							<p className='px-1 text-xs text-muted-foreground mb-1'>
								Сообщения {isFetching && '…'}
							</p>
							<div className='space-y-1'>
								{(data?.messages ?? []).map(m => (
									<button
										key={m.id}
										className={[
											'w-full text-left px-3 py-2 rounded-xl transition-colors',
											'hover:bg-[#E0F2FE] dark:hover:bg-accent/40',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
										].join(' ')}
										onClick={() => {
											selectChat(String(m.chat_id))
											window.dispatchEvent(
												new CustomEvent('chat:scrollToMessage', {
													detail: { messageId: m.id }
												})
											)
										}}
									>
										<div className='text-sm text-foreground truncate'>
											{m.content}
										</div>
										<div className='text-[11px] text-muted-foreground'>
											В чате #{m.chat_id}
										</div>
									</button>
								))}
								{!data?.messages?.length && (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										Нет совпадений
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</ScrollArea>
			<ChatModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</aside>
	)
}
