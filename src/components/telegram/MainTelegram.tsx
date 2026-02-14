'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { TgMessagesList } from '@/components/telegram/messages/TgMessagesList'
import { MessageBox } from '@/components/ui/message-box/MessageBox'

import { TgThreadsResponse } from '@/types/telegram-chat.types'

import { useSendTelegramMessage } from '@/hooks/telegram/useSendTelegramMessage'
import { useTelegramMessages } from '@/hooks/telegram/useTelegramMessages'

import { TgChatSearchInline } from './messages/TgChatSearchInline'

export function MainTelegram({
	threadId,
	groupId,
	channelId
}: {
	threadId: string | number | null
	groupId: string | number
	channelId: string | number
}) {
	const { data, isFetching } = useTelegramMessages(threadId)
	const send = useSendTelegramMessage({ threadId, groupId, channelId })

	const messages = useMemo(() => (data?.data ?? []).slice().reverse(), [data])

	const qc = useQueryClient()
	const allThreadsCaches = qc.getQueriesData<TgThreadsResponse>({
		queryKey: ['tgThreads', groupId, channelId]
	})

	const currentThread = useMemo(() => {
		const merged = allThreadsCaches.map(([, v]) => v?.data ?? []).flat()
		return merged.find(t => String(t.id) === String(threadId)) ?? null
	}, [allThreadsCaches, threadId])

	const headerTitle = useMemo(() => {
		if (!threadId) return ''
		if (!currentThread) return 'Telegram'

		const fullName =
			[currentThread.first_name, currentThread.last_name]
				.filter(Boolean)
				.join(' ') || null

		return (
			currentThread.title ??
			(currentThread.username ? `@${currentThread.username}` : null) ??
			fullName ??
			String(currentThread.external_chat_id)
		)
	}, [threadId, currentThread])

	const [showSearch, setShowSearch] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!showSearch) return

		const onClickOutside = (e: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowSearch(false)
			}
		}

		document.addEventListener('mousedown', onClickOutside)
		return () => document.removeEventListener('mousedown', onClickOutside)
	}, [showSearch])

	if (!threadId) {
		return (
			<div className='flex items-center justify-center flex-1 text-muted-foreground'>
				Диалог не выбран
			</div>
		)
	}

	return (
		<div
			className='flex flex-col'
			style={{ height: 'calc(100vh - 80px)' }}
		>
			{/* HEADER */}
			<div className='relative border-b-2 border-slate-200 py-2 px-6 flex-shrink-0'>
				<div className='flex items-start gap-4'>
					<div className='min-w-0'>
						<p className='font-semibold text-xl'>{headerTitle}</p>
					</div>

					<div
						className='flex-1 min-w-[160px]'
						ref={searchRef}
					>
						{showSearch ? (
							<TgChatSearchInline
								threadId={threadId}
								onClose={() => setShowSearch(false)}
								className='w-full'
							/>
						) : (
							<button
								className='text-slate-500 hover:text-slate-700 transition-colors mt-1'
								onClick={() => setShowSearch(true)}
								title='Поиск по диалогу'
							>
								<Search size={20} />
							</button>
						)}
					</div>
				</div>
			</div>

			{/* MESSAGES */}
			<TgMessagesList
				threadId={threadId}
				messages={messages}
				isLoading={isFetching}
			/>

			{/* INPUT */}
			<div className='w-full px-10 pt-3 pb-4 border-t-2 border-slate-200'>
				<MessageBox
					disabled={send.isPending || !threadId}
					showMentions={false}
					onSend={async ({ text, files }) => {
						await send.mutateAsync({
							text: text || undefined,
							files: files?.length ? files : undefined
						})
					}}
				/>
			</div>
		</div>
	)
}
