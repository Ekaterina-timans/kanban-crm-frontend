'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import type { IAttachment } from '@/types/message.types'

import { chatService } from '@/services/chat.service'

/** Единое построение queryKey */
const qk = {
	participants: (chatId: string | number) =>
		['chat', String(chatId), 'participants'] as const,
	attachments: (chatId: string | number) =>
		['chat', String(chatId), 'attachments'] as const
}

/** маленький helper для кастомных событий */
const emit = (name: string, detail: any) =>
	typeof window !== 'undefined' &&
	window.dispatchEvent(new CustomEvent(name, { detail }))

/** Участники (для direct-чатов не запрашиваем вообще) */
export function useChatParticipants(
	chatId: string | number,
	enabled = true,
	chatType?: 'group' | 'direct'
) {
	const reallyEnabled = enabled && chatType !== 'direct'
	return useQuery({
		queryKey: qk.participants(chatId),
		queryFn: () => chatService.listParticipants(chatId),
		enabled: reallyEnabled,
		staleTime: 30_000,
		placeholderData: prev => prev
	})
}

/** Добавление участника(ов) */
export function useAddParticipants(chatId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { emails: string[]; role?: 'member'|'admin'|'owner' }) =>
      chatService.addParticipants(chatId, { emails: p.emails, role: p.role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.participants(chatId) })
      emit('chat:participantsChanged', { chatId })
    },
  })
}

/** Изменение роли участника (оптимистично) */
export function useUpdateParticipantRole(chatId: string | number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: {
			user_id: number | string
			role: 'owner' | 'admin' | 'member'
		}) => chatService.updateParticipantRole(chatId, payload),
		onMutate: async ({ user_id, role }) => {
			const key = qk.participants(chatId)
			await qc.cancelQueries({ queryKey: key })
			const prev = qc.getQueryData<{
				my_role: 'owner' | 'admin' | 'member'
				participants: Array<{
					id: number | string
					name?: string | null
					email: string
					avatar?: string | null
					role: 'owner' | 'admin' | 'member'
				}>
			}>(key)
			if (prev) {
				qc.setQueryData(key, {
					...prev,
					participants: prev.participants.map(p =>
						p.id === user_id ? { ...p, role } : p
					)
				})
			}
			return { prev }
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) qc.setQueryData(qk.participants(chatId), ctx.prev)
		},
		onSettled: () => {
			emit('chat:participantsChanged', { chatId })
			qc.invalidateQueries({ queryKey: qk.participants(chatId) })
		}
	})
}

/** Удаление участника (оптимистично) */
export function useRemoveParticipant(chatId: string | number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: { user_id: number | string }) =>
			chatService.removeParticipant(chatId, payload),
		onMutate: async ({ user_id }) => {
			const key = qk.participants(chatId)
			await qc.cancelQueries({ queryKey: key })
			const prev = qc.getQueryData<any>(key)
			if (prev) {
				qc.setQueryData(key, {
					...prev,
					participants: prev.participants.filter((p: any) => p.id !== user_id)
				})
			}
			return { prev }
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) qc.setQueryData(qk.participants(chatId), ctx.prev)
		},
		onSettled: () => {
			emit('chat:participantsChanged', { chatId })
			qc.invalidateQueries({ queryKey: qk.participants(chatId) })
		}
	})
}

/** Вложения чата (если понадобится — переведёшь на useInfiniteQuery) */
export function useChatAttachments(chatId: string | number, enabled = true) {
	return useQuery<IAttachment[]>({
		queryKey: qk.attachments(chatId),
		queryFn: () => chatService.listAttachments(chatId),
		enabled,
		staleTime: 15_000,
		placeholderData: prev => prev
	})
}

/** Префетч на ховер, чтобы панель открывалась мгновенно */
export function useChatInfoPrefetch(chatId?: string | number) {
	const qc = useQueryClient()
	useEffect(() => {
		if (!chatId) return
		const prefetch = () => {
			qc.prefetchQuery({
				queryKey: qk.participants(chatId),
				queryFn: () => chatService.listParticipants(chatId)
			})
			qc.prefetchQuery({
				queryKey: qk.attachments(chatId),
				queryFn: () => chatService.listAttachments(chatId)
			})
		}
		// пример: дергай prefetch по своему событию
		const handler = (e: any) => {
			if (String(e.detail?.chatId) === String(chatId)) prefetch()
		}
		window.addEventListener('chat:prefetchInfo', handler)
		return () => window.removeEventListener('chat:prefetchInfo', handler)
	}, [chatId, qc])
}

/** Live-инвалидация при событиях окна (без вебсокетов) */
export function useChatInfoLiveInvalidation(chatId?: string | number) {
	const qc = useQueryClient()
	useEffect(() => {
		if (!chatId) return
		const onNewMsg = (e: any) => {
			const { chatId: cid } = e.detail || {}
			if (String(cid) === String(chatId)) {
				qc.invalidateQueries({ queryKey: qk.attachments(chatId) })
			}
		}
		const onParticipantsChanged = (e: any) => {
			const { chatId: cid } = e.detail || {}
			if (String(cid) === String(chatId)) {
				qc.invalidateQueries({ queryKey: qk.participants(chatId) })
			}
		}
		window.addEventListener('chat:messageSent', onNewMsg)
		window.addEventListener('chat:participantsChanged', onParticipantsChanged)
		return () => {
			window.removeEventListener('chat:messageSent', onNewMsg)
			window.removeEventListener(
				'chat:participantsChanged',
				onParticipantsChanged
			)
		}
	}, [chatId, qc])
}
