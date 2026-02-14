import { useMemo } from 'react'

import { FileChip } from '@/components/chats/chat/footer/AttachmentPreview'
import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { ChatOrCommentContextMenu } from '@/components/ui/context-menu/ChatOrCommentContextMenu'
import {
	DropdownMenu,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { renderMentions } from './renderMentions'
import { cn } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_BASE

export function CommentItem({
	comment: c,
	user,
	openId,
	setOpenId,
	deleteComment,
	canReply,
	canDelete,
	onReply
}: any) {
	const isMine = c.user?.email === user?.email
	const userName = c.user?.name || c.user?.email || 'Пользователь'

	const reply = useMemo(
		() =>
			((c as any).replyTo ?? (c as any).reply_to ?? null) as
				| (Partial<typeof c> & {
						id?: number | string
						user?: any
						content?: string
				  })
				| null,
		[c]
	)

	const replyAuthor =
		reply?.user?.name ??
		reply?.user?.email ??
		(reply?.id != null ? `#${reply.id}` : '')

	const createdAt = new Date(c.created_at)
	const formattedDate =
		createdAt.toLocaleDateString('ru-RU') +
		' ' +
		createdAt.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit'
		})

	return (
		<DropdownMenu
			open={openId === c.id}
			onOpenChange={o => setOpenId(o ? c.id : null)}
		>
			<DropdownMenuTrigger asChild>
				<div
					onContextMenu={e => {
						e.preventDefault()
						setOpenId(c.id)
					}}
					className={cn(
						'p-3 rounded-lg border transition cursor-context-menu bg-card',
						isMine
							? 'border-primary/25 shadow-sm'
							: 'border-border hover:bg-accent'
					)}
				>
					<div className='flex justify-between items-center mb-2'>
						<div className='flex items-center gap-2'>
							<Tooltip text={c.user?.email || ''}>
								<UserAvatar
									src={c.user?.avatar}
									name={c.user?.name ?? null}
									email={c.user?.email}
									size={32}
									className='border border-border'
								/>
							</Tooltip>

							<p
								className={cn(
									'font-medium text-sm',
									isMine ? 'text-primary' : 'text-foreground'
								)}
							>
								{userName}
							</p>
						</div>

						<p className='text-xs text-muted-foreground'>{formattedDate}</p>
					</div>

					{/* Превью ответа */}
					{reply && (
						<div className='ml-10 mb-2 rounded-md bg-muted border border-border p-2 text-xs'>
							<div className='font-medium truncate text-foreground'>
								{replyAuthor || 'Комментарий'}
							</div>
							<div className='line-clamp-2 text-muted-foreground'>
								{reply.content ?? 'Вложение'}
							</div>
						</div>
					)}

					{c.content && (
						<div className='text-sm text-foreground/90 whitespace-pre-line leading-snug ml-10 mb-2'>
							{renderMentions(c.content, c.mentioned_users ?? [])}
						</div>
					)}

					{c.attachments?.length > 0 && (
						<div className='ml-10 flex flex-wrap gap-2'>
							{c.attachments.map((att: any, i: number) => {
								const key = att.id ?? `${c.id}-att-${i}`
								const isImage = (att.mime || '').startsWith('image/')
								const fileUrl = `${API_URL}/storage/${att.path.replace(/^public\//, '')}`

								return isImage ? (
									<a
										key={key}
										href={fileUrl}
										target='_blank'
										rel='noreferrer'
										className='block overflow-hidden rounded-lg border border-border bg-card'
										title={att.original_name}
									>
										<img
											src={fileUrl}
											alt={att.original_name}
											className='h-28 w-28 object-cover'
										/>
									</a>
								) : (
									<FileChip
										key={key}
										name={att.original_name}
										subtype={att.mime?.split('/')[1]}
										className='cursor-default'
									/>
								)
							})}
						</div>
					)}
				</div>
			</DropdownMenuTrigger>

			<ChatOrCommentContextMenu
				context='comment'
				attachments={c.attachments ?? []}
				canReply={canReply}
				canDelete={canDelete}
				onReply={onReply}
				onDelete={
					canDelete
						? async () => {
								await deleteComment(c.id)
								setOpenId(null)
							}
						: undefined
				}
			/>
		</DropdownMenu>
	)
}
