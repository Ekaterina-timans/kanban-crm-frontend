'use client'

import { LogOut, Plus, Settings, User, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'

import { CreateGroupModal } from '@/components/groups/CreateGroupModal'
import { ListGroupsModal } from '@/components/groups/list-groups/ListGroupsModal'
import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator
} from '@/components/ui/dropdown/dropdown-menu'

import { useAuth } from '@/providers/AuthProvider'

import { useGroupInvitationsModal } from '@/store/useGroupInvitationsModal'

import { useLogout } from '@/hooks/auth/useLogout'
import { useRouter } from 'next/navigation'
import { DASHBOARD_PAGES } from '@/config/page.url.config'

export function MenuProfile() {
	const [isCreateModalOpen, setCreateModalOpen] = useState(false)
	const [isListModalOpen, setListModalOpen] = useState(false)

	const { logout, isPending } = useLogout()
	const { user } = useAuth()
	const router = useRouter()
	const openInvitationsModal = useGroupInvitationsModal(state => state.open)

	return (
		<>
			<DropdownMenuContent className='mr-1'>
				<DropdownMenuLabel>
					<div className='text-center'>
						{user?.name && (
							<p className='font-bold -mb-1 text-lg'>{user.name}</p>
						)}
						<p className='text-base opacity-40'>{user?.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem 
						className='cursor-pointer'
						onClick={() => router.push(DASHBOARD_PAGES.PROFILE)}
					>
						<User />
						<span className='text-lg'>Профиль</span>
					</DropdownMenuItem>
					<DropdownMenuItem 
						className='cursor-pointer'
						onClick={() => router.push(DASHBOARD_PAGES.SETTINGS)}
					>
						<Settings />
						<span className='text-lg'>Настройки</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => setListModalOpen(true)}
					>
						<Users />
						<span className='text-lg'>Мои группы</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => openInvitationsModal('participants')}
					>
						<UserPlus />
						<span className='text-lg'>Приглашения в группу</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => setCreateModalOpen(true)}
					>
						<Plus />
						<span className='text-lg'>Новая группа</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='cursor-pointer'
					onClick={() => logout()}
					disabled={isPending}
				>
					<LogOut />
					<span className='text-lg'>Выход</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
			<CreateGroupModal
				isOpen={isCreateModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>
			<ListGroupsModal
				isOpen={isListModalOpen}
				onClose={() => setListModalOpen(false)}
			/>
		</>
	)
}
