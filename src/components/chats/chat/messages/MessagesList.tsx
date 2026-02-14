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

	// ✅ один sticky-лейбл текущей даты (не копится)
	const [activeLabel, setActiveLabel] = useState<string>('')

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
		vp.addEventListener('scroll', handle, { passive: true })
		handle()
		return () => vp.removeEventListener('scroll', handle as any)
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
		vp.addEventListener('scroll', onScroll, { passive: true })
		return () => vp.removeEventListener('scroll', onScroll as any)
	}, [handleMaybeLoadOlder])

	// ✅ вычисление activeLabel по текущему скроллу (один sticky header)
	useLayoutEffect(() => {
		const vp = getViewport()
		if (!vp) return

		let raf = 0

		const calcActiveLabel = () => {
			if (raf) cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				const seps = Array.from(
					vp.querySelectorAll('[data-sep="1"]')
				) as HTMLElement[]

				if (!seps.length) {
					setActiveLabel('')
					return
				}

				// линия "верха" внутри viewport (чуть ниже для стабильности)
				const vpTop = vp.getBoundingClientRect().top
				const threshold = vpTop + 16

				let current = ''

				// последний сепаратор, дошедший до threshold
				for (const el of seps) {
					const r = el.getBoundingClientRect()
					if (r.top <= threshold) current = el.dataset.sepLabel || current
					else break
				}

				// если мы у самого верха и ни один не прошёл threshold — берём первый
				if (!current) current = seps[0].dataset.sepLabel || ''

				setActiveLabel(current)
			})
		}

		vp.addEventListener('scroll', calcActiveLabel, { passive: true })
		calcActiveLabel()

		return () => {
			vp.removeEventListener('scroll', calcActiveLabel as any)
			if (raf) cancelAnimationFrame(raf)
		}
	}, [rows.length])

	return (
		<ScrollArea
			ref={scrollAreaRef}
			className='flex-1 px-4'
		>
			{/* ✅ один sticky header с датой */}
			{activeLabel && (
				<div className='sticky top-2 z-20 flex justify-center pointer-events-none'>
					<span className='px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border shadow-sm'>
						{activeLabel}
					</span>
				</div>
			)}

			<div className='space-y-4 py-4'>
				{isLoading && !messages.length && (
					<div className='text-sm text-muted-foreground'>Загрузка…</div>
				)}

				{loadingOlder && (
					<div className='text-xs text-muted-foreground text-center'>
						Загружаем ранние сообщения…
					</div>
				)}

				{rows.map(row => {
					if (row.type === 'sep') {
						// ❗️сепараторы БЕЗ sticky, только маркеры для вычисления activeLabel
						return (
							<div
								key={row.id}
								data-sep='1'
								data-sep-label={row.label}
								className='flex justify-center'
							>
								<span className='px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border shadow-sm'>
									{row.label}
								</span>
							</div>
						)
					}

					const m = row.message
					const mine = String(m.user_id) === String(myId)

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
					type='button'
					variant='secondary'
					size='icon'
					className={cn(
						'absolute bottom-4 right-4 rounded-full shadow-lg',
						'border border-border',
						'bg-card text-foreground hover:bg-accent',
						'opacity-90 hover:opacity-100 transition'
					)}
				>
					<ArrowDown />
				</Button>
			)}
		</ScrollArea>
	)
}
