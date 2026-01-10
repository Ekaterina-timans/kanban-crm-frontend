'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '@/providers/AuthProvider'

import { TabName } from '@/types/components.types'
import { IModalProps } from '@/types/modal.types'

import { ModalWrapper } from '../../ui/modal/ModalWrapper'

import { AddingParticipant } from './AddingParticipant'
import { InvitationHistory } from './InvitationHistory'
import { RequestGroups } from './RequestsGroups'
import { cn } from '@/lib/utils'
import { groupService } from '@/services/group.service'

interface InvitationsGroupModalProps extends IModalProps {
	defaultTab?: TabName
}

export function InvitationsGroupModal({
	isOpen,
	onClose,
	defaultTab
}: InvitationsGroupModalProps) {
	const [invitePolicy, setInvitePolicy] = useState<'admin_only' | 'all' | null>(
		null
	)
	const { currentGroupId, currentGroupRole } = useAuth()
	const [activeTab, setActiveTab] = useState<TabName>('participants')

	useEffect(() => {
		if (!isOpen || !currentGroupId) return

		groupService.getGroupById(currentGroupId).then(group => {
			setInvitePolicy(group.invite_policy ?? null)
		})
	}, [isOpen, currentGroupId])

	const canInvite =
		invitePolicy === 'all' ||
		(invitePolicy === 'admin_only' && currentGroupRole === 'admin')

	// инициализация активного таба с учётом defaultTab и canInvite
	useEffect(() => {
		if (!isOpen) return

		if (!defaultTab) {
			setActiveTab(canInvite ? 'participants' : 'invitations')
			return
		}

		if (defaultTab === 'participants' && !canInvite) {
			setActiveTab('invitations')
		} else {
			setActiveTab(defaultTab)
		}
	}, [defaultTab, canInvite, isOpen])

	// если право приглашать пропало, а таб всё ещё participants — переключаем
	useEffect(() => {
		if (!isOpen) return

		if (!canInvite && activeTab === 'participants') {
			setActiveTab('invitations')
		}
	}, [canInvite, activeTab, isOpen])

	if (!isOpen || !currentGroupId) return null

	return (
		<ModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			className='w-[650px] max-w-[65vw]'
		>
			<button
				type='button'
				onClick={onClose}
				aria-label='Закрыть'
				className='absolute top-1 right-2 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
			>
				<X className='w-5 h-5' />
			</button>

			<Tabs
				className='mt-4'
				value={activeTab}
				onValueChange={v => setActiveTab(v as TabName)}
			>
				<TabsList
					className={cn(
						'mb-4 w-full rounded-xl bg-muted p-1 grid gap-1',
						canInvite ? 'grid-cols-3' : 'grid-cols-2'
					)}
				>
					{canInvite && (
						<TabsTrigger
							className='w-full justify-center text-sm font-medium'
							value='participants'
						>
							Пригласить участника
						</TabsTrigger>
					)}

					<TabsTrigger
						className='w-full justify-center text-sm font-medium'
						value='invitations'
					>
						Приглашения в группы
					</TabsTrigger>

					<TabsTrigger
						className='w-full justify-center text-sm font-medium'
						value='history'
					>
						История приглашений
					</TabsTrigger>
				</TabsList>

				{canInvite && (
					<TabsContent value='participants'>
						<AddingParticipant />
					</TabsContent>
				)}

				<TabsContent value='invitations'>
					<RequestGroups />
				</TabsContent>

				<TabsContent value='history'>
					<InvitationHistory />
				</TabsContent>
			</Tabs>
		</ModalWrapper>
	)
}
