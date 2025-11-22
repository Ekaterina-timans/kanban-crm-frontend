'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'

import { IMessage } from '@/types/message.types'

import { getEcho } from '@/lib/echoClient'
import { messageService } from '@/services/message.service'

type Cursors = {
	oldest_id: number | null
	newest_id: number | null
	has_older: boolean
	has_newer: boolean
}

export function useChatMessages(chatId: string | number | null) {
	const qc = useQueryClient()
	const [items, setItems] = useState<IMessage[]>([])
	const [cursors, setCursors] = useState<Cursors>({
		oldest_id: null,
		newest_id: null,
		has_older: false,
		has_newer: false
	})
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingOlder, setIsLoadingOlder] = useState(false)
	const [isPolling, setIsPolling] = useState(false)
	const pollTimer = useRef<number | null>(null)
	const socketBound = useRef(false)

	// сбрасываем при смене чата
	useEffect(() => {
		setItems([])
		setCursors({
			oldest_id: null,
			newest_id: null,
			has_older: false,
			has_newer: false
		})

		// очистить таймер
		if (pollTimer.current) {
			clearInterval(pollTimer.current)
			pollTimer.current = null
		}
		socketBound.current = false
	}, [chatId])

	// первичная загрузка последних N
	useEffect(() => {
		if (!chatId) return
		const cid = String(chatId)
		let cancelled = false

		async function bootstrap() {
			setIsLoading(true)
			try {
				const { messages, cursors } = await messageService.list(cid, {
					limit: 30
				})
				if (cancelled) return
				setItems(messages)
				setCursors(cursors)
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		}
		bootstrap()
		return () => {
			cancelled = true
		}
	}, [chatId])

	// подгрузка старых
	const loadOlder = async () => {
		if (!chatId || !cursors.oldest_id || !cursors.has_older || isLoadingOlder)
			return
		setIsLoadingOlder(true)
		try {
			const { messages, cursors: nextC } = await messageService.list(chatId, {
				limit: 30,
				before_id: cursors.oldest_id
			})
			// prepend
			setItems(prev => [...messages, ...prev])
			setCursors(nextC)
		} finally {
			setIsLoadingOlder(false)
		}
	}

	// polling новых сообщений по after_id=newest_id
	useEffect(() => {
		if (!chatId) return
		// запустим polling только после первой загрузки, когда знаем newest_id
		if (!cursors.newest_id) return
		if (pollTimer.current) clearInterval(pollTimer.current)

		setIsPolling(true)
		pollTimer.current = window.setInterval(async () => {
			try {
				const { messages, cursors: nextC } = await messageService.list(chatId, {
					limit: 50,
					after_id: cursors.newest_id!
				})
				if (messages.length) {
					setItems(prev => [...prev, ...messages])
					setCursors(nextC)
				}
			} catch {}
		}, 3000)
		return () => {
			if (pollTimer.current) clearInterval(pollTimer.current)
			pollTimer.current = null
			setIsPolling(false)
		}
	}, [chatId, cursors.newest_id])

	// (опционально) WebSocket: подписка на события чата
	useEffect(() => {
		if (!chatId) return
		if (socketBound.current) return
		let echo: ReturnType<typeof getEcho> | null = null

		try {
			echo = getEcho()
			// пример: приватный канал "private-chat.#{id}" или как ты именуешь
			const channel = echo.private(`chat.${chatId}`)
			channel.listen('MessageCreated', (payload: { message: IMessage }) => {
				setItems(prev => {
					// не дублируем
					if (prev.some(m => m.id === payload.message.id)) return prev
					return [...prev, payload.message].sort(
						(a, b) => Number(a.id) - Number(b.id)
					)
				})
				setCursors(prev => ({
					...prev,
					newest_id: Math.max(prev.newest_id ?? 0, Number(payload.message.id)),
					has_newer: false
				}))
			})
			socketBound.current = true
			return () => {
				try {
					echo?.leave(`chat.${chatId}`)
				} catch {}
				socketBound.current = false
			}
		} catch {
			// echo не настроен — живём только на polling
		}
	}, [chatId])

	useEffect(() => {
		const onCleared = (e: Event) => {
			const ce = e as CustomEvent<{ chatId: string }>
			if (!chatId) return
			if (String(chatId) !== ce.detail.chatId) return
			// моментально очищаем список и курсоры
			setItems([])
			setCursors({
				oldest_id: null,
				newest_id: null,
				has_older: false,
				has_newer: false
			})
			// остановим polling до следующей загрузки
			if (pollTimer.current) {
				clearInterval(pollTimer.current)
				pollTimer.current = null
				setIsPolling(false)
			}
		}
		window.addEventListener('chat:cleared', onCleared as EventListener)
		return () =>
			window.removeEventListener('chat:cleared', onCleared as EventListener)
	}, [chatId])

	useEffect(() => {
		const onMessageSent = (e: Event) => {
			const ce = e as CustomEvent<{ chatId: string; message: IMessage }>
			if (!chatId) return
			if (String(chatId) !== ce.detail.chatId) return

			setItems(prev => {
				if (prev.some(m => m.id === ce.detail.message.id)) return prev
				return [...prev, ce.detail.message]
			})
			setCursors(prev => ({
				...prev,
				newest_id: Math.max(prev.newest_id ?? 0, Number(ce.detail.message.id)),
				has_newer: false
			}))
		}

		window.addEventListener('chat:messageSent', onMessageSent as EventListener)
		return () =>
			window.removeEventListener(
				'chat:messageSent',
				onMessageSent as EventListener
			)
	}, [chatId])

	useEffect(() => {
		const onDeleted = (e: Event) => {
			const ce = e as CustomEvent<{
				chatId: string
				messageId: number | string
			}>
			if (!chatId) return
			if (String(chatId) !== ce.detail.chatId) return

			setItems(prev => {
				const next = prev.filter(
					m => String(m.id) !== String(ce.detail.messageId)
				)
				return next
			})
			// курсоры можно не трогать — polling и след. запрос поправят;
			// при желании можно пересчитать newest_id из next.at(-1)?.id
		}

		window.addEventListener('chat:messageDeleted', onDeleted as EventListener)
		return () =>
			window.removeEventListener(
				'chat:messageDeleted',
				onDeleted as EventListener
			)
	}, [chatId])

	const newestId = useMemo(
		() => cursors.newest_id ?? items.at(-1)?.id ?? null,
		[cursors.newest_id, items]
	)

	return {
		messages: items,
		newestId,
		hasOlder: cursors.has_older,
		loadOlder,
		isLoading,
		isLoadingOlder,
		isPolling,
		refetchAll: async () => {
			if (!chatId) return
			const { messages, cursors } = await messageService.list(chatId, {
				limit: 30
			})
			setItems(messages)
			setCursors(cursors)
			await qc.invalidateQueries({ queryKey: ['messages', String(chatId)] })
		}
	}
}
