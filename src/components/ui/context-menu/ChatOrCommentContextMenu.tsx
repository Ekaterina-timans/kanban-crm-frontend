import { CornerUpRight, Trash2 } from 'lucide-react'

import { AttachmentMenu } from '@/components/ui/attachment/AttachmentMenu'
import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator
} from '@/components/ui/dropdown/dropdown-menu'

import { IAttachment } from '@/types/message.types'

type ContextType = 'chat' | 'comment'
type UserRole = 'owner' | 'admin' | 'member'

interface Props {
	context: ContextType
	role?: UserRole
	mine?: boolean
	attachments: IAttachment[]
	canReply?: boolean
	canDelete?: boolean
	onReply?: () => void
	onDelete?: () => void
}

/**
 * Контекстное меню для чатов и комментариев.
 * Автоматически применяет правила доступа в зависимости от роли и контекста.
 */
export function ChatOrCommentContextMenu({
	context,
	role,
	mine = false,
	attachments,
	canReply,
	canDelete,
	onReply,
	onDelete
}: Props) {
	const canDeleteFinal =
		typeof canDelete === 'boolean'
			? canDelete
			: mine || ['owner', 'admin'].includes(role || '')

	const canReplyFinal =
		typeof canReply === 'boolean' ? canReply : !mine && context === 'chat'

	return (
		<DropdownMenuContent className='w-[260px]'>
			{canReplyFinal && onReply && (
				<>
					<DropdownMenuItem
						onClick={onReply}
						className='cursor-pointer'
					>
						<CornerUpRight />
						<span className='text-sm'>Ответить</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
				</>
			)}

			{attachments.length > 0 && (
				<>
					<DropdownMenuGroup>
						{attachments.map(att => (
							<div
								key={att.id}
								className='flex flex-col'
							>
								<AttachmentMenu att={att} />
							</div>
						))}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
				</>
			)}

			{canDeleteFinal && onDelete && (
				<DropdownMenuItem
					onClick={onDelete}
					className='cursor-pointer text-red-600 focus:text-red-700'
				>
					<Trash2 />
					<span className='text-sm'>Удалить</span>
				</DropdownMenuItem>
			)}
		</DropdownMenuContent>
	)
}
