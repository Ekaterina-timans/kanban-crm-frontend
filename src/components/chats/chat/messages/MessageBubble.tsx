'use client'

import { useMemo, useState } from 'react'

import { renderMentions } from '@/components/projects/tasks-project/kanban-view/task/task-id/comments/renderMentions'
import { ChatOrCommentContextMenu } from '@/components/ui/context-menu/ChatOrCommentContextMenu'
import {
	DropdownMenu,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'

import { ChatType } from '@/types/chat.type'
import { IMessage } from '@/types/message.types'

import { useSelectedChat } from '@/store/useSelectedChat'

import { useMyChatRole } from '@/hooks/chat/useMyChatRole'
import { useDeleteMessage } from '@/hooks/message/useDeleteMessage'

import { colorForId } from './colorName'
import { cn } from '@/lib/utils'
import { formatTime } from '@/utils/date-utils'

type BubbleProps = {
	message: IMessage
	mine: boolean
	onReply: (m: IMessage) => void
	onJumpToMessage?: (id: number | string) => void
	chatType: ChatType
}

export function MessageBubble({
	message: m,
	mine,
	onReply,
	onJumpToMessage,
	chatType
}: BubbleProps) {
	const time = formatTime(m.created_at)
	const [open, setOpen] = useState(false)
	const { selectedChatId } = useSelectedChat()
	const del = useDeleteMessage(selectedChatId)
	const { role } = useMyChatRole(selectedChatId, chatType)

	// Нормализация ответа: поддерживаем и replyTo, и reply_to
	const reply = useMemo(
		() =>
			((m as any).replyTo ?? (m as any).reply_to ?? null) as
				| (Partial<IMessage> & {
						id?: number | string
						user?: any
						content?: string
				  })
				| null,
		[m]
	)

	const replyAuthor =
		reply?.user?.name ??
		reply?.user?.email ??
		(reply?.id != null ? `#${reply.id}` : '')

	const attachments = m.attachments ?? []

	const authorName = useMemo(
		() => m.user?.name ?? m.user?.email ?? 'Пользователь',
		[m.user]
	)
	const authorColor = useMemo(() => colorForId(m.user_id), [m.user_id])

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenuTrigger asChild>
				<div
					onContextMenu={e => {
						e.preventDefault()
						setOpen(true)
					}}
					className='select-text outline-none'
				>
					<div
						className={cn(
							'relative max-w-xs rounded-lg px-3 py-2 text-sm',
							mine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
						)}
					>
						{/* Имя автора вверху пузыря (как в VK/Telegram) */}
						{!mine && (
							<div
								className='mb-1 font-semibold leading-none'
								style={{ color: authorColor }}
							>
								{authorName}
							</div>
						)}

						{/* Мини-цитата (reply preview) */}
						{reply && (
							<div
								className={cn(
									'mb-2 rounded-md p-2 text-xs',
									mine ? 'bg-blue-400/40' : 'bg-gray-300'
								)}
							>
								<div className='font-medium truncate'>{replyAuthor}</div>
								<div className='line-clamp-2 opacity-90'>
									{reply.content ?? 'Вложение'}
								</div>
							</div>
						)}

						{/* Вложения */}
						{attachments.length ? (
							<div
								className={cn(
									'mb-2 flex flex-wrap gap-2',
									mine ? 'justify-end' : 'justify-start'
								)}
							>
								{attachments.map(att => {
									const isImg = (att.mime ?? '').startsWith('image/')
									if (isImg) {
										return (
											<a
												key={att.id}
												href={att.url ?? '#'}
												target='_blank'
												rel='noreferrer'
												title={att.original_name}
												className='block overflow-hidden rounded-lg border bg-white'
												onClick={e => e.stopPropagation()}
											>
												<img
													src={att.url ?? ''}
													alt={att.original_name}
													className='h-28 w-28 object-cover'
												/>
											</a>
										)
									}
									return (
										<a
											key={att.id}
											href={att.url ?? '#'}
											target='_blank'
											rel='noreferrer'
											title={att.original_name}
											className='inline-flex max-w-[260px] items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm'
											onClick={e => e.stopPropagation()}
										>
											<div className='flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold'>
												{(att.mime?.split('/')[1] || 'FILE').toUpperCase()}
											</div>
											<span className='truncate'>{att.original_name}</span>
										</a>
									)
								})}
							</div>
						) : null}

						{/* Текст */}
						{m.content && (
							<div
								className={cn(
									'text-sm leading-snug whitespace-pre-line break-words',
									mine ? 'text-white' : 'text-gray-900'
								)}
							>
								{renderMentions(m.content, m.mentioned_users ?? [])}
							</div>
						)}

						{/* Время */}
						<span
							className={cn(
								'mt-1 block text-xs opacity-70',
								mine && 'text-right'
							)}
						>
							{time}
						</span>
					</div>
				</div>
			</DropdownMenuTrigger>
			<ChatOrCommentContextMenu
				context='chat'
				role={role}
				mine={mine}
				attachments={attachments}
				onReply={!mine ? () => onReply(m) : undefined}
				onDelete={
					mine || ['owner', 'admin'].includes(role)
						? async () => {
								await del.mutateAsync(m.id)
								setOpen(false)
							}
						: undefined
				}
			/>
		</DropdownMenu>
	)
}
