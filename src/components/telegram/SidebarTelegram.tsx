'use client'

import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import Field from '@/components/ui/field/Field'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { useTelegramGlobalSearch } from '@/hooks/telegram/useTelegramGlobalSearch'
import { useTelegramThreads } from '@/hooks/telegram/useTelegramThreads'
import { useDebounced } from '@/hooks/useDebounced'

import { CardInfoChat } from '../chats/sidebar/CardInfoChat'

export function SidebarTelegram({
	groupId,
	channelId,
	selectedThreadId,
	onSelectThread
}: {
	groupId: string | number
	channelId: string | number
	selectedThreadId: string | number | null
	onSelectThread: (id: string | number) => void
}) {
	const [q, setQ] = useState('')
	const debounced = useDebounced(q, 300)
	const hasQuery = debounced.trim().length > 0

	// 1) обычный список тредов (без поиска)
	const threadsQ = useTelegramThreads(groupId, channelId)
	const threads = useMemo(() => threadsQ.data?.data ?? [], [threadsQ.data])

	// 2) глобальный поиск по каналу (как в чате)
	const searchQ = useTelegramGlobalSearch(groupId, channelId, debounced)
	const foundThreads = useMemo(
		() => searchQ.data?.threads ?? [],
		[searchQ.data]
	)
	const foundMessages = useMemo(
		() => searchQ.data?.messages ?? [],
		[searchQ.data]
	)

	const makeTitle = (t: any) => {
		const fullName =
			[t.first_name, t.last_name].filter(Boolean).join(' ') || null
		return (
			t.title ??
			(t.username ? `@${t.username}` : null) ??
			fullName ??
			String(t.external_chat_id)
		)
	}

	return (
		<aside className='h-full bg-card border-r border-border overflow-hidden p-3 flex flex-col'>
			<div className='mt-3'>
				<Field
					placeholder='Поиск…'
					value={q}
					onChange={e => setQ(e.target.value)}
					leftIcon={Search}
					rightIcon={q ? X : undefined}
					onRightIconClick={() => setQ('')}
				/>
			</div>

			<ScrollArea className='min-h-0 flex-1 mt-3 pr-1'>
				{/* --- РЕЖИМ 1: без запроса -> обычный список --- */}
				{!hasQuery && (
					<div className='space-y-1 px-0.5'>
						{threadsQ.error && (
							<div className='text-sm text-red-600 p-2'>
								{String(threadsQ.error)}
							</div>
						)}

						{threadsQ.isFetching && !threads.length && (
							<div className='text-sm text-muted-foreground p-2'>Загрузка…</div>
						)}

						{threads.map(t => {
							const title = makeTitle(t)
							const isSelected = String(selectedThreadId) === String(t.id)

							return (
								<CardInfoChat
									key={t.id}
									chat={{
										id: t.id,
										title,
										avatar: null,
										last_message: t.last_message_text ?? 'Нет сообщений',
										unread_count: 0,
										showAvatar: false
									}}
									isSelected={isSelected}
									onClick={() => onSelectThread(t.id)}
								/>
							)
						})}

						{!threadsQ.isFetching && threads.length === 0 && (
							<div className='text-sm text-muted-foreground p-2'>
								Диалоги не найдены
							</div>
						)}
					</div>
				)}

				{/* --- РЕЖИМ 2: есть запрос -> глобальный поиск (как в чате) --- */}
				{hasQuery && (
					<div className='mt-3 overflow-auto space-y-3'>
						{searchQ.error && (
							<div className='text-sm text-red-600 p-2'>
								{String(searchQ.error)}
							</div>
						)}

						<div>
							<p className='px-1 text-xs text-muted-foreground mb-1'>
								Диалоги {searchQ.isFetching && '…'}
							</p>

							<div className='space-y-1'>
								{foundThreads.map((t: any) => {
									const title = makeTitle(t)
									const isSelected = String(selectedThreadId) === String(t.id)

									return (
										<CardInfoChat
											key={t.id}
											chat={{
												id: t.id,
												title,
												avatar: null,
												last_message: t.last_message_text ?? 'Нет сообщений',
												unread_count: 0,
												showAvatar: false
											}}
											isSelected={isSelected}
											onClick={() => onSelectThread(t.id)}
										/>
									)
								})}

								{!foundThreads.length && !searchQ.isFetching && (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										Нет совпадений
									</div>
								)}
							</div>
						</div>

						<div>
							<p className='px-1 text-xs text-muted-foreground mb-1'>
								Сообщения {searchQ.isFetching && '…'}
							</p>

							<div className='space-y-1'>
								{foundMessages.map((m: any) => (
									<button
										key={m.id}
										className={[
											'w-full text-left px-3 py-2 rounded-xl transition-colors',
											'hover:bg-[#E0F2FE] dark:hover:bg-accent/40',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
										].join(' ')}
										onClick={() => {
											// открыть нужный тред
											onSelectThread(String(m.channel_thread_id))

											// прокрутить к сообщению (сделаем событие как в чате)
											window.dispatchEvent(
												new CustomEvent('tg:scrollToMessage', {
													detail: { messageId: m.id }
												})
											)
										}}
									>
										<div className='text-sm text-foreground truncate'>
											{m.text}
										</div>
										<div className='text-[11px] text-muted-foreground'>
											В диалоге #{m.channel_thread_id}
										</div>
									</button>
								))}

								{!foundMessages.length && !searchQ.isFetching && (
									<div className='px-3 py-2 text-sm text-muted-foreground'>
										Нет совпадений
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</ScrollArea>
		</aside>
	)
}
