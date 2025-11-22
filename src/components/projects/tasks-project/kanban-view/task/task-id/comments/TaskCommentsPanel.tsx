'use client'

import { useState } from 'react'

import { MessageBox } from '@/components/ui/message-box/MessageBox'
import { ScrollArea } from '@/components/ui/scroll/scroll-area'

import { useAuth } from '@/providers/AuthProvider'

import { Permission } from '@/types/permission.enum'

import { useSpaceAccessStore } from '@/store/useSpaceAccessStore'

import { useCreateComment } from '@/hooks/comment/useCreateComment'
import { useDeleteComment } from '@/hooks/comment/useDeleteComment'
import { useGetComments } from '@/hooks/comment/useGetComments'

import { CommentItem } from './CommentItem'
import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'

export function TaskCommentsPanel({ taskId, spaceId }: { taskId: string, spaceId: string }) {
	const [openId, setOpenId] = useState<string | number | null>(null)
	const [replyTo, setReplyTo] = useState<any | null>(null)

	const { comments, isLoading } = useGetComments(taskId)
	const { createComment } = useCreateComment()
	const { deleteComment } = useDeleteComment()
	const { user } = useAuth()

	const { data: spaceUsers = [] } = useGetSpaceUsers(spaceId)

	const taskMembers = (spaceUsers || []).map((u: any) => ({
		id: u.user.id,
		name: u.user.name,
		email: u.user.email
	}))

	const can = useSpaceAccessStore(s => s.can)
	const canRead = can(Permission.COMMENT_READ)
	const canAdd = can(Permission.COMMENT_CREATE)
	const canDeleteOwn = can(Permission.COMMENT_DELETE)
	const canDeleteAll = can(Permission.COMMENT_ALL)

	if (!canRead) return null

	return (
		<div className='flex flex-col h-full min-h-0 border-l border-gray-200 pl-4'>
			<h3 className='font-semibold text-blue-600 mb-3'>Комментарии</h3>

			<ScrollArea className='flex-1 min-h-0 pr-1 mb-3'>
				<div className='space-y-3'>
					{isLoading && <p className='text-gray-400 text-sm'>Загрузка...</p>}

					{!isLoading && comments?.length === 0 && (
						<p className='text-sm text-gray-400'>Комментариев пока нет.</p>
					)}

					{comments?.map(c => {
						const mine = c.user?.id === user?.id
						const canDelete = (mine && canDeleteOwn) || canDeleteAll
						const canReply = canAdd && !mine

						return (
							<CommentItem
								key={c.id}
								comment={c}
								user={user}
								openId={openId}
								setOpenId={setOpenId}
								deleteComment={deleteComment}
								canReply={canReply}
								canDelete={canDelete}
								onReply={() => setReplyTo(c)}
							/>
						)
					})}
				</div>
			</ScrollArea>

			{/* Индикация «ответить на …» */}
			{replyTo && (
				<div className='mb-2 px-3 py-2 rounded-md bg-blue-50 border border-blue-200 text-sm flex items-start justify-between'>
					<div className='pr-3'>
						<div className='font-medium text-blue-700'>
							Ответ на:{' '}
							{replyTo.user?.name || replyTo.user?.email || 'Комментарий'}
						</div>
						{replyTo.content && (
							<div className='text-blue-800 opacity-80 line-clamp-2'>
								{replyTo.content}
							</div>
						)}
					</div>
					<button
						className='text-blue-600 hover:text-blue-700'
						onClick={() => setReplyTo(null)}
					>
						отменить
					</button>
				</div>
			)}

			{canAdd && (
				<div className='w-full border-t-2 border-slate-200'>
					<MessageBox
						mentionMembers={taskMembers}
						onSend={async ({ text, files, mentioned_user_ids }) => {
							await createComment({
								taskId,
								content: text || '',
								files,
								reply_to_id: replyTo?.id ?? null,
								mentioned_user_ids
							})
							setReplyTo(null)
						}}
						placeholder='Написать комментарий...'
					/>
				</div>
			)}
		</div>
	)
}
