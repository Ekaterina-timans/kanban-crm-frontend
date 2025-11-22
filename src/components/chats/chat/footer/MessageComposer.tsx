import { X } from 'lucide-react'

import { MessageBox } from '@/components/ui/message-box/MessageBox'

import { useReplyTarget } from '@/store/useReplyTarget'
import { useSelectedChat } from '@/store/useSelectedChat'

import { useChat } from '@/hooks/chat/useChat'
import { useChatParticipants } from '@/hooks/chat/useChatInfo'
import { useSendMessage } from '@/hooks/message/useSendMessage'

export function MessageComposer() {
	const { selectedChatId } = useSelectedChat()
	const sendMsg = useSendMessage(selectedChatId)
	const { replyTo, clearReply } = useReplyTarget()

	const { chat } = useChat(selectedChatId)
	const isGroup = chat?.type === 'group'

	const { data: participantsData } = useChatParticipants(
		selectedChatId!,
		isGroup,
		chat?.type
	)

	const chatMembers = isGroup
		? (participantsData?.participants?.map((p: any) => ({
				id: p.id,
				name: p.name,
				email: p.email
			})) ?? [])
		: []

	return (
		<div className='w-full px-10 pt-3 pb-4 border-t-2 border-slate-200'>
			{/* Плашка "Ответ на ..." */}
			{replyTo && (
				<div className='mb-2 flex items-start justify-between rounded-md bg-slate-100 p-2 text-xs'>
					<div className='mr-2 min-w-0'>
						<div className='font-medium truncate'>
							{replyTo.user?.name ?? replyTo.user?.email ?? `#${replyTo.id}`}
						</div>
						<div className='truncate opacity-80'>
							{replyTo.content ?? 'Вложение'}
						</div>
					</div>
					<button
						className='shrink-0 p-1 opacity-70 hover:opacity-100'
						onClick={clearReply}
						aria-label='Отменить ответ'
						title='Отменить ответ'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
			)}
			<MessageBox
				disabled={sendMsg.isPending || !selectedChatId}
				mentionMembers={chatMembers}
        showMentions={isGroup}
				onSend={async ({ text, files, mentioned_user_ids }) => {
					if (!selectedChatId) return
					await sendMsg.mutateAsync({
						content: text || undefined,
						files: files?.length ? files : undefined,
						reply_to_id: replyTo ? Number(replyTo.id) : undefined,
						mentioned_user_ids,
					})
					clearReply()
				}}
			/>
		</div>
	)
}
