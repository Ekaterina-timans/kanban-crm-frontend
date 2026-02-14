'use client'

import {
	Eraser,
	Images,
	LogOut,
	MoreVertical,
	Palette,
	Search,
	Trash2,
	Users
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown/dropdown-menu'

import { useAuth } from '@/providers/AuthProvider'

import { ChatRole, ChatType } from '@/types/chat.type'

import { useSelectedChat } from '@/store/useSelectedChat'

import { useClearHistory } from '@/hooks/chat/useClearHistory'
import { useDeleteChat } from '@/hooks/chat/useDeleteChat'
import { useLeaveChat } from '@/hooks/chat/useLeaveChat'
import { useMyChatRole } from '@/hooks/chat/useMyChatRole'

import { ChatInfoPanel } from './ChatInfoPanel'
import { ChatSearchInline } from './ChatSearchInline'

export function HeaderChat({
	title,
	participantsCount,
	chatType,
	myRole,
	permissions
}: {
	title: string
	participantsCount?: number
	chatType: ChatType
	myRole: ChatRole
	permissions: ReturnType<typeof useMyChatRole>['permissions']
}) {
	const { selectedChatId } = useSelectedChat()
	const { currentGroupId } = useAuth()
	const [showSearch, setShowSearch] = useState(false)

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [infoOpen, setInfoOpen] = useState(false)
	const [infoTab, setInfoTab] = useState<'participants' | 'files'>(
		'participants'
	)

	const clearHistory = useClearHistory()
	const deleteChat = useDeleteChat(currentGroupId)
	const leaveChat = useLeaveChat()

	const searchRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!showSearch) return

		const onClickOutside = (e: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowSearch(false)
			}
		}

		document.addEventListener('mousedown', onClickOutside)
		return () => document.removeEventListener('mousedown', onClickOutside)
	}, [showSearch])

	const pluralize = (n: number, one: string, few: string, many: string) => {
		const abs = Math.abs(n),
			n10 = abs % 10,
			n100 = abs % 100
		if (n10 === 1 && n100 !== 11) return one
		if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few
		return many
	}

	const pc = typeof participantsCount === 'number' ? participantsCount : null

	return (
		<>
			<div className='relative border-b-2 border-slate-200 py-2 px-6 flex-shrink-0'>
				<div className='flex items-start gap-4'>
					{/* 1) заголовок (сверху) */}
					<div className='min-w-0'>
						<p className='font-semibold text-xl'>{title}</p>
						{pc !== null && (
							<Button
								variant='link'
								onClick={() => {
									setInfoTab('participants')
									setInfoOpen(true)
								}}
								className='h-auto p-0 text-slate-500 hover:text-slate-700 underline-offset-2 hover:underline'
							>
								<small>
									{pc} {pluralize(pc, 'участник', 'участника', 'участников')}
								</small>
							</Button>
						)}
					</div>

					{/* 2) место под поиск — тянется между title и меню */}
					<div
						className='flex-1 min-w-[160px]'
						ref={searchRef}
					>
						{showSearch ? (
							selectedChatId && (
								<ChatSearchInline
									chatId={selectedChatId}
									onClose={() => setShowSearch(false)}
									className='w-full'
								/>
							)
						) : (
							<button
								className='text-slate-500 hover:text-slate-700 transition-colors mt-1'
								onClick={() => setShowSearch(true)}
								title='Поиск по чату'
							>
								<Search size={20} />
							</button>
						)}
					</div>

					{/* 3) меню – приклеено к верху, как заголовок */}
					<div className='shrink-0'>
						<DropdownMenu
							open={isDropdownOpen}
							onOpenChange={open => {
								setIsDropdownOpen(open)
								if (!open) {
									const trigger = document.getElementById('dropdown-trigger')
									if (trigger) trigger.focus()
								}
							}}
						>
							<DropdownMenuTrigger asChild>
								<button
									className='text-slate-500 hover:text-slate-700 transition-colors mt-1'
									id='dropdown-trigger'
								>
									<MoreVertical size={20} />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								{chatType === 'group' && (
									<DropdownMenuItem
										onClick={() => {
											setInfoTab('participants')
											setInfoOpen(true)
											setIsDropdownOpen(false)
										}}
									>
										<Users /> Участники
									</DropdownMenuItem>
								)}

								<DropdownMenuItem
									onClick={() => {
										setInfoOpen(true)
										setIsDropdownOpen(false)
										setInfoTab('files')
									}}
								>
									<Images /> Файлы чата
								</DropdownMenuItem>
								{/* Очистка истории (всегда доступна, но очищает только себе) */}
								{permissions.canAddParticipant && (
									<DropdownMenuItem
										onClick={() =>
											selectedChatId &&
											!clearHistory.isPending &&
											clearHistory.mutate(selectedChatId)
										}
										disabled={!selectedChatId || clearHistory.isPending}
									>
										<Eraser />{' '}
										{clearHistory.isPending ? 'Очищаю…' : 'Очистить историю'}
									</DropdownMenuItem>
								)}
								{/* Выйти из чата */}
								{permissions.canLeaveChat && (
									<DropdownMenuItem
										onClick={() =>
											selectedChatId &&
											!leaveChat.isPending &&
											leaveChat.mutate(selectedChatId)
										}
										disabled={!selectedChatId || leaveChat.isPending}
									>
										<LogOut />{' '}
										{leaveChat.isPending ? 'Выходим…' : 'Выйти из чата'}
									</DropdownMenuItem>
								)}
								{/* Удалить чат (только владелец) */}
								{permissions.canDeleteChat && (
									<DropdownMenuItem
										className='cursor-pointer text-red-600 focus:text-red-700'
										onClick={() =>
											selectedChatId &&
											!deleteChat.isPending &&
											deleteChat.mutate(selectedChatId)
										}
										disabled={!selectedChatId || deleteChat.isPending}
									>
										<Trash2 />{' '}
										{deleteChat.isPending ? 'Удаляю…' : 'Удалить чат'}
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			{selectedChatId && (
				<ChatInfoPanel
					chatId={selectedChatId}
					chatType={chatType}
					myRole={myRole}
					permissions={permissions}
					open={infoOpen}
					onOpenChange={open => {
						setInfoOpen(open)
						if (!open) {
							const trigger = document.getElementById('dropdown-trigger')
							if (trigger) trigger.focus()
						}
					}}
					initialTab={infoTab}
				/>
			)}
		</>
	)
}
