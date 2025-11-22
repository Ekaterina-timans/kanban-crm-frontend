'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/ui/modal/ModalWrapper'

import { IModalProps } from '@/types/modal.types'
import { ISpaceUser } from '@/types/user.types'

import { usePermissions } from '@/hooks/permission/usePermissions'
import { getUserRights } from '@/hooks/space-user/getUserRights'
import { useUpdateUserPermissions } from '@/hooks/space-user/useUpdateUserPermissions'

import { defaultPermissions } from './roleAndPermissions'

interface IRightsModalProps extends IModalProps {
	user: ISpaceUser | null
	spaceId?: string
}

export function RightsModal({
	isOpen,
	onClose,
	user,
	spaceId
}: IRightsModalProps) {
	if (!isOpen || !user) return null

	const { data: allPermissions = [] } = usePermissions()
	const { data: userRights, isLoading: isLoadingRights } = getUserRights(
		String(user.id)
	)
	const { updateUserPermissions } = useUpdateUserPermissions(spaceId || '')

	const [rights, setRights] = useState(defaultPermissions)

	/** Когда пришли права пользователя — подставляем актуальные значения */
	useEffect(() => {
		if (!userRights || !allPermissions.length) return

		const userPermissionNames =
			userRights.permissions?.map((p: any) => p.name) || []

		setRights(prev =>
			prev.map(row => {
				const updated = { ...row.permissions }
				for (const key of Object.keys(row.permissions)) {
					const name = `${row.systemCategory}_${key}`
					updated[key as keyof typeof row.permissions] =
						userPermissionNames.includes(name)
				}
				return { ...row, permissions: updated }
			})
		)
	}, [userRights, allPermissions])

	const toggle = (
		rowIndex: number,
		key: keyof (typeof rights)[0]['permissions']
	) => {
		setRights(prev =>
			prev.map((row, i) =>
				i === rowIndex
					? {
							...row,
							permissions: { ...row.permissions, [key]: !row.permissions[key] }
						}
					: row
			)
		)
	}

	const handleSave = () => {
		if (!userRights) return

		const enabledNames = rights.flatMap(row =>
			Object.entries(row.permissions)
				.filter(([_, v]) => v)
				.map(([k]) => `${row.systemCategory}_${k}`)
		)

		const ids = allPermissions
			.filter(p => enabledNames.includes(p.name))
			.map(p => p.id)

		updateUserPermissions({ spaceUserId: String(user.id), permissions: ids })
		onClose()
	}

	if (isLoadingRights)
		return (
			<ModalWrapper
				className='w-[700px]'
				isOpen={isOpen}
				onClose={onClose}
			>
				<p className='text-center text-gray-500 py-6'>
					Загрузка прав пользователя...
				</p>
			</ModalWrapper>
		)

	return (
		<ModalWrapper
			className='w-[700px]'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2 className='text-lg mb-4 text-center font-semibold text-blue-600'>
				Редактирование прав доступа — {user.user?.name || user.user?.email}
			</h2>

			<div className='overflow-x-auto mb-6'>
				<table className='w-full border border-gray-200 rounded-lg text-sm'>
					<thead className='bg-blue-50 text-blue-600'>
						<tr>
							<th className='p-2 text-left'>Область</th>
							<th className='p-2'>Чтение</th>
							<th className='p-2'>Создание</th>
							<th className='p-2'>Редактирование</th>
							<th className='p-2'>Удаление</th>
						</tr>
					</thead>
					<tbody>
						{rights.map((row, i) => (
							<tr
								key={i}
								className='border-t hover:bg-blue-50 transition'
							>
								<td className='p-2 font-medium text-gray-700'>
									{row.category}
								</td>
								{['read', 'create', 'edit', 'delete'].map(key => (
									<td
										key={key}
										className='text-center p-2'
									>
										{row.permissions[key as keyof typeof row.permissions] !==
										undefined ? (
											<input
												type='checkbox'
												checked={
													row.permissions[
														key as keyof typeof row.permissions
													] || false
												}
												onChange={() =>
													toggle(
														i,
														key as keyof (typeof rights)[0]['permissions']
													)
												}
												className='w-4 h-4 accent-blue-600 cursor-pointer'
											/>
										) : (
											<span className='text-gray-300'>—</span>
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className='flex justify-between'>
				<Button onClick={handleSave}>Сохранить</Button>
				<Button onClick={onClose}>Отмена</Button>
			</div>
		</ModalWrapper>
	)
}
