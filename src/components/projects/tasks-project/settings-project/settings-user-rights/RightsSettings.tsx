'use client'

import { Pencil, Trash2, UserPlus2 } from 'lucide-react'
import { useState } from 'react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { Button } from '@/components/ui/button/Button'
import { SelectComponent } from '@/components/ui/select/SelectComponent'

import { useAuth } from '@/providers/AuthProvider'

import { TRole } from '@/types/role.type'

import { useGroupMembers } from '@/hooks/group/useGroupMembers'
import { useAddSpaceUser } from '@/hooks/space-user/useAddSpaceUser'
import { useGetSpaceUsers } from '@/hooks/space-user/useGetSpaceUsers'
import { useRemoveSpaceUser } from '@/hooks/space-user/useRemoveSpaceUser'
import { useUpdateUserRole } from '@/hooks/space-user/useUpdateUserRole'

import { RightsModal } from './RightsModal'
import { roleOptions } from './roleAndPermissions'

export function RightsSettings({ spaceId }: { spaceId: string }) {
	const [isRightsModalOpen, setRightsModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<any>(null)

	const [newUserId, setNewUserId] = useState('')
	const [newRole, setNewRole] = useState<TRole>('viewer')

	const { user, currentGroupId } = useAuth()

	const { data: spaceUsers = [], isLoading } = useGetSpaceUsers(spaceId)
	const { members: groupMembers = [] } = useGroupMembers(
		currentGroupId,
		'',
		true
	)
	const { addSpaceUser } = useAddSpaceUser(spaceId)
	const { removeSpaceUser } = useRemoveSpaceUser(spaceId)
	const { updateUserRole } = useUpdateUserRole(spaceId)

	const handleAddUser = () => {
		if (!newUserId || !newRole) return
		addSpaceUser({ userId: newUserId, role: newRole })
		setNewUserId('')
		setNewRole('viewer')
	}

	const handleRoleChange = (spaceUserId: number, role: string) => {
		updateUserRole({ spaceUserId: String(spaceUserId), role: role as TRole })
	}

	if (isLoading)
		return <p className='text-center text-muted-foreground'>Загрузка...</p>

	const availableUsers = groupMembers
		.filter(
			(member: any) =>
				member.id !== user?.id &&
				!spaceUsers.some((su: any) => su.user_id === member.id)
		)
		.map((member: any) => ({
			value: String(member.id),
			label: member.name || member.email
		}))

	return (
		<div className='space-y-4'>
			<h3 className='text-center'>
				Пользователи пространства
			</h3>

			{/* Блок добавления пользователя */}
			<div className='border border-border rounded-lg bg-card p-3 shadow-sm space-y-2'>
				<div className='flex justify-between gap-2'>
					<SelectComponent
						options={availableUsers}
						placeholder='Выберите пользователя'
						selectedValue={newUserId}
						onChange={setNewUserId}
					/>

					<SelectComponent
						options={roleOptions}
						placeholder='Выберите роль'
						selectedValue={newRole}
						onChange={value => setNewRole(value as TRole)}
					/>
				</div>

				<div className='flex justify-end'>
					<Button
						size='sm'
						variant='outline'
						onClick={handleAddUser}
						disabled={!newUserId}
						className='flex items-center gap-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground'
					>
						<UserPlus2 className='w-4 h-4' />
						Добавить
					</Button>
				</div>
			</div>

			{/* Таблица пользователей */}
			<div className='border border-border rounded-lg bg-card overflow-hidden divide-y divide-border'>
				{spaceUsers.length === 0 && (
					<p className='text-center text-muted-foreground py-3 italic'>
						Пользователей пока нет
					</p>
				)}

				{spaceUsers.map((su: any) => {
					const u = su.user

					return (
						<div
							key={su.id}
							className='flex items-center justify-between px-2 py-3 hover:bg-accent transition-colors'
						>
							{/* Левая часть */}
							<div className='flex items-center gap-2 min-w-0'>
								<UserAvatar
									src={u?.avatar}
									name={u?.name ?? null}
									email={u?.email}
									size={35}
								/>
								<p className='font-medium text-foreground truncate'>
									{u?.name || u?.email || 'Без имени'}
								</p>
							</div>

							{/* Правая часть */}
							<div className='flex items-center gap-2 w-[280px] justify-center'>
								<div className='w-[165px]'>
									<SelectComponent
										options={roleOptions}
										selectedValue={su.role}
										onChange={val => handleRoleChange(su.id, val)}
									/>
								</div>

								<Button
									variant='ghost'
									size='icon'
									className='text-muted-foreground hover:text-foreground'
									onClick={() => {
										setSelectedUser(su)
										setRightsModalOpen(true)
									}}
								>
									<Pencil className='w-5 h-5' />
								</Button>

								<Button
									variant='ghost'
									size='icon'
									className='text-destructive hover:opacity-90'
									onClick={() => removeSpaceUser(String(su.id))}
								>
									<Trash2 className='w-5 h-5' />
								</Button>
							</div>
						</div>
					)
				})}
			</div>

			<RightsModal
				isOpen={isRightsModalOpen}
				onClose={() => setRightsModalOpen(false)}
				user={selectedUser}
				spaceId={spaceId}
			/>
		</div>
	)
}
