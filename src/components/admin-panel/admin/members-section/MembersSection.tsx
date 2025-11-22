'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { DataTable } from '@/components/ui/table/DataTable'

import { useAuth } from '@/providers/AuthProvider'

import { useGroupInvitationsModal } from '@/store/useGroupInvitationsModal'

import { useGroupMembers } from '@/hooks/group/useGroupMembers'
import { useRemoveMember } from '@/hooks/group/useRemoveMember'
import {
	useBlockMember,
	useUnblockMember
} from '@/hooks/group/useUnBlockMember'

import { formatDateForCard } from '@/utils/date-utils'

import { membersColumns } from './members-table-columns'

export function MembersSection() {
	const [search, setSearch] = useState('')
	const { currentGroupId, user } = useAuth()
	const { members, isLoading } = useGroupMembers(currentGroupId, '', true)
	if (currentGroupId == null) return null

	const { open } = useGroupInvitationsModal()

	const blockMember = useBlockMember(currentGroupId)
	const unblockMember = useUnblockMember(currentGroupId)
	const removeMember = useRemoveMember(currentGroupId)

	const rows = members.map(m => ({
		id: m.id,
		name: m.name,
		email: m.email,
		avatar: m.avatar,
		status: m.pivot.status,
		role: m.pivot.role,
		joinedAt: m.pivot.created_at,
		joinedAtFormatted: formatDateForCard(m.pivot.created_at),

		currentUserId: user?.id,
		onBlock: (id: number) => blockMember.mutate(id),
		onUnblock: (id: number) => unblockMember.mutate(id),
		onRemove: (id: number) => removeMember.mutate(id)
	}))

	const filtered = rows.filter(row => {
		const q = search.toLowerCase()
		return (
			row.name?.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
		)
	})

	return (
		<div className='space-y-6'>
			<h3 className='text-xl font-semibold text-blue-600'>Участники группы</h3>
			<div className='flex justify-between items-center'>
				<Field
					placeholder='Поиск...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					leftIcon={Search}
					leftIconClassName='text-gray-500'
					className='w-64'
				/>

				<Button onClick={() => open('participants')}>Добавить участника</Button>
			</div>

			<DataTable
				columns={membersColumns}
				data={filtered}
				isLoading={isLoading}
			/>
		</div>
	)
}
