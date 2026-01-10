import { X } from 'lucide-react'

import { useAuth } from '@/providers/AuthProvider'

import { IModalProps } from '@/types/modal.types'

import { useGroups } from '@/hooks/group/useGroups'

import { ModalWrapper } from '../../ui/modal/ModalWrapper'
import { DataTable } from '../../ui/table/DataTable'

import { groupColumns } from './group-table-columns'

export function ListGroupsModal({ isOpen, onClose }: IModalProps) {
	const { groups, isLoading } = useGroups()
	const { currentGroupId, setCurrentGroupId } = useAuth()

	if (!isOpen) return null
	// не используешь вложенное поле pivot.created_at в самой таблице
	// у каждой группы поле joined_at на верхнем уровне — это проще писать колонки таблицы
	const groupsForTable = groups.map(g => ({
		...g,
		joined_at: g.pivot?.created_at,
		role: g.pivot?.role
	}))

	const onChangeGroup = (groupId: string | number) => {
		const idGroup = String(groupId)
		localStorage.setItem('currentGroupId', idGroup)
		setCurrentGroupId(String(groupId))
		onClose()
	}

	return (
		<ModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			className='w-full max-w-3xl'
		>
			<button
				type='button'
				className='absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
				aria-label='Закрыть'
				onClick={onClose}
			>
				<X className='w-5 h-5' />
			</button>
			<h2 className='text-xl font-semibold text-foreground text-center mb-4'>
				Ваши группы
			</h2>
			{isLoading ? (
				<div className='text-center py-6'>Загрузка...</div>
			) : (
				<DataTable
					columns={groupColumns(currentGroupId, onChangeGroup)}
					data={groupsForTable}
				/>
			)}
		</ModalWrapper>
	)
}
