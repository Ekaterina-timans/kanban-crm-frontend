'use client'

import { ArrowDown } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { ITgMessage } from '@/types/telegram-chat.types'

import { dateSeparatorLabel, formatTime } from '@/utils/date-utils'

import { TgMessageBubble } from './TgMessageBubble'
import { cn } from '@/lib/utils'

type Row =
	| { type: 'sep'; id: string; label: string }
	| { type: 'msg'; id: string | number; message: ITgMessage }

export function TgMessagesList({
	threadId,
	messages,
	isLoading
}: {
	threadId: string | number
	messages: ITgMessage[]
	isLoading?: boolean
}) {
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const [showScrollButton, setShowScrollButton] = useState(false)
	const [highlightId, setHighlightId] = useState<string | null>(null)

	// ✅ ОДИН sticky-лейбл "текущей даты"
	const [activeLabel, setActiveLabel] = useState<string>('')

	const uniqMessages = useMemo(() => {
		const seen = new Set<string | number>()
		const out: ITgMessage[] = []
		for (const m of messages) {
			if (seen.has(m.id)) continue
			seen.add(m.id)
			out.push(m)
		}
		return out
	}, [messages])

	const getMsgIso = (m: ITgMessage) => {
		if (m.provider_date) return new Date(m.provider_date * 1000).toISOString()
		return m.created_at
	}

	const rows: Row[] = useMemo(() => {
		const out: Row[] = []
		let lastLabel = ''

		for (const m of uniqMessages) {
			const label = dateSeparatorLabel(getMsgIso(m))
			if (label && label !== lastLabel) {
				out.push({ type: 'sep', id: `sep-${label}`, label })
				lastLabel = label
			}
			out.push({ type: 'msg', id: m.id, message: m })
		}

		return out
	}, [uniqMessages])

	const getViewport = () =>
		scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]'
		) as HTMLElement | null

	// Автоскролл вниз при новых сообщениях
	useLayoutEffect(() => {
		const vp = getViewport()
		if (vp) vp.scrollTop = vp.scrollHeight
	}, [messages.length])

	// Показ кнопки "вниз"
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

	// 🎯 Обработка перехода к найденному сообщению
	useEffect(() => {
		const handler = (e: any) => {
			const id = String(e.detail?.messageId ?? '')
			if (!id) return

			const vp = getViewport()
			if (!vp) return

			const el = vp.querySelector(`[data-msg-id="${id}"]`) as HTMLElement | null

			if (el) {
				el.scrollIntoView({ block: 'center', behavior: 'smooth' })
				setHighlightId(id)

				setTimeout(() => {
					setHighlightId(null)
				}, 2000)
			}
		}

		window.addEventListener('tg:scrollToMessage', handler)
		return () => window.removeEventListener('tg:scrollToMessage', handler)
	}, [])

	// ✅ Логика вычисления "текущей даты" для одного sticky-лейбла
	useLayoutEffect(() => {
		const vp = getViewport()
		if (!vp) return

		const calcActiveLabel = () => {
			// Все сепараторы внутри viewport
			const seps = Array.from(
				vp.querySelectorAll('[data-sep="1"]')
			) as HTMLElement[]

			if (!seps.length) {
				setActiveLabel('')
				return
			}

			// Линия "верха" внутри viewport (чуть ниже, чтобы было стабильнее)
			const vpTop = vp.getBoundingClientRect().top
			const threshold = vpTop + 16

			let current = ''

			// Ищем последний сепаратор, который уже дошёл до "верхней линии"
			for (const el of seps) {
				const r = el.getBoundingClientRect()
				if (r.top <= threshold) current = el.dataset.sepLabel || current
				else break
			}

			// Если мы в самом верху и ни один sep не дошёл до threshold — берём первый
			if (!current) current = seps[0].dataset.sepLabel || ''

			setActiveLabel(current)
		}

		vp.addEventListener('scroll', calcActiveLabel, { passive: true })
		// пересчёт на старте / при изменении rows
		calcActiveLabel()

		return () => vp.removeEventListener('scroll', calcActiveLabel as any)
	}, [rows.length])

	return (
		<ScrollArea
			ref={scrollAreaRef}
			className='flex-1 px-4'
		>
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

				{rows.map(row => {
					if (row.type === 'sep') {
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
					const mine = m.direction === 'out'
					const timeIso = getMsgIso(m)
					const time = formatTime(timeIso)
					const isHighlighted = String(m.id) === highlightId

					return (
						<div
							key={row.id}
							data-msg-id={String(m.id)}
							className={cn(
								'flex transition-all duration-300',
								mine ? 'justify-end' : 'justify-start',
								isHighlighted && 'bg-yellow-200/40 rounded-xl p-1'
							)}
						>
							<TgMessageBubble
								threadId={threadId}
								message={m}
								mine={mine}
								time={time}
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
					className='absolute bottom-4 right-4 rounded-full shadow-lg border border-border bg-card text-foreground'
				>
					<ArrowDown />
				</Button>
			)}
		</ScrollArea>
	)
}
