'use client'

import { ArrowDown } from 'lucide-react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { Button } from '@/components/ui/button/Button'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { useAuth } from '@/providers/AuthProvider'

import { ChatType } from '@/types/chat.type'
import { IMessage } from '@/types/message.types'

import { useReplyTarget } from '@/store/useReplyTarget'

import { dateSeparatorLabel } from '@/utils/date-utils'

import { MessageBubble } from './MessageBubble'
import { cn } from '@/lib/utils'

type MessageProps = {
	messages: IMessage[]
	isLoading?: boolean
	hasOlder?: boolean
	onLoadOlder?: () => void
	chatType: ChatType
}

type Row =
	| { type: 'sep'; id: string; label: string }
	| { type: 'msg'; id: number | string; message: IMessage }

export function MessagesList({
	messages,
	isLoading,
	hasOlder,
	onLoadOlder,
	chatType
}: MessageProps) {
	const { user } = useAuth()
	const myId = user?.id
	const { setReplyTo } = useReplyTarget()
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const [showScrollButton, setShowScrollButton] = useState(false)
	const [loadingOlder, setLoadingOlder] = useState(false)

	const uniqMessages = useMemo(() => {
		const seen = new Set<string | number>()
		const out: IMessage[] = []
		for (const m of messages) {
			const k = (m as any).client_id ?? m.id
			if (seen.has(k)) continue
			seen.add(k)
			out.push(m)
		}
		return out
	}, [messages])

	const rows: Row[] = useMemo(() => {
		const out: Row[] = []
		let lastLabel = ''
		for (const m of uniqMessages) {
			const label = dateSeparatorLabel(m.created_at)
			if (label && label !== lastLabel) {
				out.push({ type: 'sep', id: `sep-${label}`, label })
				lastLabel = label
			}
			out.push({ type: 'msg', id: (m as any).client_id ?? m.id, message: m })
		}
		return out
	}, [uniqMessages])

	// получить viewport ScrollArea
	const getViewport = () =>
		scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]'
		) as HTMLElement | null

	// автопрокрутка вниз при появлении новых сообщений
	useLayoutEffect(() => {
		const vp = getViewport()
		if (vp) {
			vp.scrollTop = vp.scrollHeight
		}
	}, [messages.length])

	// show/hide кнопки «вниз»
	useLayoutEffect(() => {
		const vp = getViewport()
		if (!vp) return
		const handle = () => {
			const { scrollTop, clientHeight, scrollHeight } = vp
			const nearBottom = scrollTop + clientHeight >= scrollHeight - 120
			setShowScrollButton(!nearBottom)
		}
		vp.addEventListener('scroll', handle)
		handle()
		return () => vp.removeEventListener('scroll', handle)
	}, [messages.length])

	const scrollToBottom = () => {
		const vp = getViewport()
		if (vp) vp.scrollTop = vp.scrollHeight
	}

	// бесконечная прокрутка вверх
	const handleMaybeLoadOlder = useCallback(async () => {
		const vp = getViewport()
		if (!vp || !hasOlder || !onLoadOlder || loadingOlder) return
		// близко к верху?
		if (vp.scrollTop <= 80) {
			setLoadingOlder(true)
			const prevHeight = vp.scrollHeight
			await onLoadOlder()
			// после подгрузки удерживаем позицию, чтобы не скакал контент
			requestAnimationFrame(() => {
				const newHeight = vp.scrollHeight
				vp.scrollTop = newHeight - prevHeight + vp.scrollTop
				setLoadingOlder(false)
			})
		}
	}, [hasOlder, onLoadOlder, loadingOlder])

	// listener для подгрузки вверх
	useLayoutEffect(() => {
		const vp = getViewport()
		if (!vp) return
		const onScroll = () => handleMaybeLoadOlder()
		vp.addEventListener('scroll', onScroll)
		return () => vp.removeEventListener('scroll', onScroll)
	}, [handleMaybeLoadOlder])

	return (
		<ScrollArea
			ref={scrollAreaRef}
			className='flex-1 px-4'
		>
			<div className='space-y-4 py-4'>
				{isLoading && !messages.length && (
					<div className='text-sm text-slate-500'>Загрузка…</div>
				)}

				{loadingOlder && (
					<div className='text-xs text-slate-400 text-center'>
						Загружаем ранние сообщения…
					</div>
				)}

				{rows.map(row => {
					if (row.type === 'sep') {
						return (
							<div
								key={row.id}
								className='sticky top-2 z-10 flex justify-center'
							>
								<span className='px-3 py-1 text-xs rounded-full bg-slate-200 text-slate-700'>
									{row.label}
								</span>
							</div>
						)
					}
					const m = row.message
					const mine = String(m.user_id) === String(myId)
					const authorInitial = (m.user?.name ?? m.user?.email ?? '?')
						.slice(0, 1)
						.toUpperCase()

					return (
						<div
							key={row.id}
							className={cn(
								'group flex items-start gap-3',
								mine ? 'justify-end' : 'justify-start'
							)}
						>
							{!mine && (
								<UserAvatar
									src={m.user?.avatar}
									name={m.user?.name ?? null}
									email={m.user?.email}
									size={32}
									className='h-8 w-8'
								/>
							)}

							<MessageBubble
								message={m}
								mine={mine}
								onReply={setReplyTo}
								chatType={chatType}
							/>
						</div>
					)
				})}
			</div>

			{showScrollButton && (
				<Button
					onClick={scrollToBottom}
					className='absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg opacity-80 hover:opacity-100 transition-opacity'
					size='sm'
				>
					<ArrowDown />
				</Button>
			)}
		</ScrollArea>
	)
}
