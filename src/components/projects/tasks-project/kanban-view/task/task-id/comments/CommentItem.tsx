import { useMemo } from 'react'

import { FileChip } from '@/components/chats/chat/footer/AttachmentPreview'
import { ChatOrCommentContextMenu } from '@/components/ui/context-menu/ChatOrCommentContextMenu'
import {
	DropdownMenu,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip/Tooltip'

import { renderMentions } from './renderMentions'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/ui/avatar/UserAvatar'

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
	const userInitial = userName[0]?.toUpperCase() || '?'

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
						'p-3 rounded-lg border bg-white transition cursor-context-menu',
						isMine
							? 'border-blue-200 shadow-sm'
							: 'border-gray-200 hover:bg-slate-50'
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
									className='border border-gray-200'
								/>
							</Tooltip>

							<p
								className={`font-medium text-sm ${isMine ? 'text-blue-600' : 'text-gray-800'}`}
							>
								{userName}
							</p>
						</div>

						<p className='text-xs text-gray-400'>{formattedDate}</p>
					</div>

					{/* ДОБАВЛЕННЫЙ БЛОК ПРЕВЬЮ ОТВЕТА */}
					{reply && (
						<div className='ml-10 mb-2 rounded-md bg-slate-100 p-2 text-xs'>
							<div className='font-medium truncate'>
								{replyAuthor || 'Комментарий'}
							</div>
							<div className='line-clamp-2 opacity-80'>
								{reply.content ?? 'Вложение'}
							</div>
						</div>
					)}

					{c.content && (
						<div className='text-sm text-gray-700 whitespace-pre-line leading-snug ml-10 mb-2'>
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
										className='block overflow-hidden rounded-lg border bg-white'
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
