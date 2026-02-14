import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { telegramChatService } from '@/services/telegram-chat.service'

export function useSendTelegramMessage(params: {
	threadId: string | number | null | undefined
	groupId: string | number
	channelId: string | number
}) {
	const qc = useQueryClient()
	const { threadId, groupId, channelId } = params

	return useMutation({
		mutationFn: (p: { text?: string; files?: File[] }) => {
			if (!threadId) throw new Error('Диалог не выбран')
			const file = p.files?.[0] ?? null
			if (file) return telegramChatService.sendMessageWithFile({ threadId, text: p.text, file })
			return telegramChatService.sendMessage({ threadId, text: p.text ?? '' })
		},
		onSuccess: () => {
			// сообщения в открытом треде
			if (threadId) qc.invalidateQueries({ queryKey: ['tgMessages', threadId] })

			// список тредов слева (чтобы last_message_text обновился сразу)
			qc.invalidateQueries({
				queryKey: ['tgThreads', groupId, channelId],
				exact: false
			})
		},
		onError: (e: any) => {
			toast.error(e?.message ?? 'Не удалось отправить')
		}
	})
}
