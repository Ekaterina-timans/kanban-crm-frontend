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
		>
			<button
				className='absolute top-4 right-4 text-muted-foreground hover:text-black transition-colors'
				onClick={onClose}
			>
				<X className='w-5 h-5' />
			</button>

			<Tabs
				className='mt-4'
				value={activeTab}
				onValueChange={v => setActiveTab(v as TabName)}
			>
				<TabsList className='mb-1 w-full flex'>
					{canInvite && (
						<TabsTrigger
							className='flex-1 text-center'
							value='participants'
						>
							Пригласить участника
						</TabsTrigger>
					)}

					<TabsTrigger
						className='flex-1 text-center'
						value='invitations'
					>
						Приглашения в группы
					</TabsTrigger>

					<TabsTrigger
						className='flex-1 text-center'
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
