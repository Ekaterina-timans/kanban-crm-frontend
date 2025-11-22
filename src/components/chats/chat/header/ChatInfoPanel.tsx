'use client'

import { useEffect, useState } from 'react'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sidebar/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ChatRole, ChatType } from '@/types/chat.type'

import {
	useChatAttachments,
	useChatParticipants
} from '@/hooks/chat/useChatInfo'
import { useMyChatRole } from '@/hooks/chat/useMyChatRole'

import { FilesTab } from './files/FilesTab'
import { ParticipantsTab } from './participants/ParticipantsTab'

type Tab = 'participants' | 'files'

export function ChatInfoPanel({
	chatId,
	chatType,
	myRole,
	permissions,
	open,
	onOpenChange,
	initialTab = 'participants'
}: {
	chatId: string | number
	chatType: ChatType
	myRole: ChatRole
	permissions: ReturnType<typeof useMyChatRole>['permissions']
	open: boolean
	onOpenChange: (open: boolean) => void
	initialTab?: Tab
}) {
	const [tab, setTab] = useState<Tab>(
		chatType === 'direct' ? 'files' : initialTab
	)
	const showParticipants = chatType !== 'direct'
	const activeTab: Tab = showParticipants ? tab : 'files'

	useEffect(() => {
		if (open) setTab(chatType === 'direct' ? 'files' : initialTab)
	}, [open, initialTab, chatType])

	// Загружаем участников
	const { data: partsData, isFetching: loadingUsers } = useChatParticipants(
		chatId,
		open && activeTab === 'participants',
		chatType
	)

	const participants = partsData?.participants ?? []

	const { data: files = [], isFetching: loadingFiles } = useChatAttachments(
		chatId,
		open && activeTab === 'files'
	)

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side='right'
				className='w-[500px] sm:max-w-[500px]'
				aria-describedby={undefined}
			>
				<SheetHeader>
					<SheetTitle>Информация о чате</SheetTitle>
					<SheetDescription className='sr-only'>
						Список участников и файлов выбранного чата
					</SheetDescription>
				</SheetHeader>

				<Tabs
					className='mt-4'
					value={activeTab}
					onValueChange={v => setTab(v as Tab)}
				>
					<TabsList className='mb-2 w-full'>
						{showParticipants && (
							<TabsTrigger
								className='flex-1'
								value='participants'
							>
								Участники
							</TabsTrigger>
						)}
						<TabsTrigger
							className='flex-1'
							value='files'
						>
							Файлы
						</TabsTrigger>
					</TabsList>

					{showParticipants && (
						<TabsContent value='participants'>
							{loadingUsers ? (
								<div className='text-sm text-slate-500'>Загрузка…</div>
							) : (
								<ParticipantsTab
									chatId={chatId}
									permissions={permissions}
									participants={participants}
								/>
							)}
						</TabsContent>
					)}

					<TabsContent value='files'>
						<FilesTab
							files={files}
							loadingFiles={loadingFiles}
						/>
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	)
}
