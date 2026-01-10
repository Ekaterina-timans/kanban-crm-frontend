'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/ui/modal/ModalWrapper'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table/table'

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
				className='w-[760px] max-w-[95vw]'
				isOpen={isOpen}
				onClose={onClose}
			>
				<p className='text-center text-muted-foreground py-6'>
					Загрузка прав пользователя...
				</p>
			</ModalWrapper>
		)

	return (
		<ModalWrapper
			className='w-[760px]'
			isOpen={isOpen}
			onClose={onClose}
		>
			<h2 className='text-lg font-semibold text-foreground mb-4 text-center'>
				Редактирование прав доступа — {user.user?.name || user.user?.email}
			</h2>

			<div className='mb-6'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Область</TableHead>
							<TableHead className='text-center'>Чтение</TableHead>
							<TableHead className='text-center'>Создание</TableHead>
							<TableHead className='text-center'>Редактирование</TableHead>
							<TableHead className='text-center'>Удаление</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{rights.map((row, i) => (
							<TableRow key={i}>
								<TableCell className='font-medium'>{row.category}</TableCell>

								{(['read', 'create', 'edit', 'delete'] as const).map(key => (
									<TableCell
										key={key}
										className='text-center'
									>
										{row.permissions[key] !== undefined ? (
											<input
												type='checkbox'
												checked={row.permissions[key] || false}
												onChange={() => toggle(i, key)}
												className='h-4 w-4 cursor-pointer accent-primary'
											/>
										) : (
											<span className='text-muted-foreground/50'>—</span>
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className='mt-6 flex items-center justify-end gap-3'>
				<Button
					variant='default'
					onClick={handleSave}
				>
					Сохранить
				</Button>
				<Button
					variant='secondary'
					onClick={onClose}
				>
					Отмена
				</Button>
			</div>
		</ModalWrapper>
	)
}
