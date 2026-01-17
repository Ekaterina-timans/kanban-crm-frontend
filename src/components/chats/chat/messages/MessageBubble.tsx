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

import { formatTime } from '@/utils/date-utils'

import { cn } from '@/lib/utils'
import { colorForId } from '@/constants/colors'

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
							'relative max-w-xs rounded-xl px-3 py-2 text-sm shadow-sm',
							mine
								? 'bg-primary text-primary-foreground'
								: 'bg-muted text-foreground border border-border'
						)}
					>
						{/* Имя автора вверху пузыря (как в VK/Telegram) */}
						{!mine && (
							<div
								className='mb-1 font-semibold leading-none'
								style={{
									color: authorColor,
									opacity: mine ? 0.9 : 1
								}}
							>
								{authorName}
							</div>
						)}

						{/* Мини-цитата (reply preview) */}
						{reply && (
							<div
								className={cn(
									'mb-2 rounded-lg p-2 text-xs',
									mine
										? 'bg-primary-foreground/10'
										: 'bg-background/60 border border-border'
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
												className='block overflow-hidden rounded-lg border border-border bg-card'
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
											className='inline-flex max-w-[260px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm text-foreground'
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
									'chat-message-content text-sm leading-snug whitespace-pre-line break-words',
									mine
										? 'chat-message-content--mine'
										: 'chat-message-content--other'
								)}
							>
								{renderMentions(m.content, m.mentioned_users ?? [])}
							</div>
						)}

						{/* Время */}
						<span
							className={cn(
								'mt-1 block text-[11px]',
								mine
									? 'text-primary-foreground/70 text-right'
									: 'text-muted-foreground'
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
