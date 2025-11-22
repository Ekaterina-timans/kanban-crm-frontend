'use client'

import { Loader2, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Field from '@/components/ui/field/Field'

import { IMessage } from '@/types/message.types'

import { useDebounced } from '@/hooks/useDebounced'

import { cn } from '@/lib/utils'
import { chatService } from '@/services/chat.service'
import { formatTime } from '@/utils/date-utils'

type Props = {
	chatId: string | number
	onClose: () => void
	className?: string // ширина контейнера с инпутом (мы дадим w-full извне)
}

export function ChatSearchInline({ chatId, onClose, className }: Props) {
	const [q, setQ] = useState('')
	const debounced = useDebounced(q, 300)
	const [loading, setLoading] = useState(false)
	const [items, setItems] = useState<IMessage[]>([])
	const [error, setError] = useState<string | null>(null)
	const [cursor, setCursor] = useState<number>(-1)

	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	// запрос к API
	useEffect(() => {
		let cancelled = false
		;(async () => {
			setError(null)
			setItems([])
			setCursor(-1)
			if (!debounced.trim()) return
			setLoading(true)
			try {
				const res = await chatService.searchInChat(chatId, debounced.trim(), {
					limit: 100
				})
				if (!cancelled) {
					setItems(res.messages)
					setCursor(res.messages.length ? 0 : -1)
				}
			} catch (e: any) {
				if (!cancelled) setError(e?.message || 'Ошибка поиска')
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [chatId, debounced])

	// клавиатура
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
			if (!items.length) return
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setCursor(i => Math.min(i + 1, items.length - 1))
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				setCursor(i => Math.max(i - 1, 0))
			}
			if (e.key === 'Enter' && cursor >= 0) {
				e.preventDefault()
				jumpTo(items[cursor])
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [items, cursor, onClose])

	const jumpTo = (m: IMessage) => {
		window.dispatchEvent(
			new CustomEvent('chat:scrollToMessage', {
				detail: { messageId: m.id, query: debounced.trim() }
			})
		)
		onClose()
	}

	const hasQuery = q.trim().length > 0

	return (
		<div className={cn('relative', className)}>
			{/* сам инпут (занимает всю ширину контейнера) */}
			<Field
				ref={inputRef as any}
				placeholder='Поиск по чату…'
				value={q}
				onChange={e => setQ(e.target.value)}
				leftIcon={Search}
				rightIcon={X}
				onRightIconClick={() => setQ('')}
				className='!mt-0'
			/>

			{/* абсолютный дропдаун поверх чата */}
			{hasQuery && (
				<div className='absolute left-0 right-0 top-full mt-2 z-20 rounded-lg border bg-white shadow-sm'>
					<div className='px-3 py-2 text-xs text-slate-500 border-b'>
						{loading ? (
							<span className='inline-flex items-center gap-2'>
								<Loader2
									className='animate-spin'
									size={14}
								/>{' '}
								Ищем…
							</span>
						) : error ? (
							<span className='text-red-600'>{error}</span>
						) : (
							<>Найдено: {items.length}</>
						)}
					</div>

					<div className='max-h-64 overflow-auto'>
						{!loading && !error && items.length === 0 && (
							<div className='px-3 py-2 text-sm text-slate-500'>
								Нет совпадений
							</div>
						)}

						{items.map((m, i) => (
							<button
								key={m.id}
								onClick={() => jumpTo(m)}
								onMouseEnter={() => setCursor(i)}
								className={cn(
									'w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-slate-50',
									i === cursor && 'bg-slate-100'
								)}
							>
								<span className='text-[11px] text-slate-500 shrink-0'>
									{formatTime(m.created_at)}
								</span>
								<span className='text-sm truncate'>
									{m.content || '(без текста)'}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
