import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'

import { ChatType } from '@/types/chat.type'
import { IGroupMember } from '@/types/group.types'
import { IModalProps } from '@/types/modal.types'

import { useCreateChat } from '@/hooks/chat/useCreateChat'
import { useGroupMembers } from '@/hooks/group/useGroupMembers'
import { useDebounced } from '@/hooks/useDebounced'

import { Button } from '../ui/button/Button'
import Field from '../ui/field/Field'
import { ModalWrapper } from '../ui/modal/ModalWrapper'

export function ChatModal({ isOpen, onClose }: IModalProps) {
	const { currentGroupId, user } = useAuth()
	const [chatType, setChatType] = useState<ChatType>('group')
	const [title, setTitle] = useState('')
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState<IGroupMember[]>([])
	const debouncedQ = useDebounced(query, 300)

	const { members, isLoading, isFetching } = useGroupMembers(
		currentGroupId,
		debouncedQ,
		isOpen
	)
	const { createChat, isPending, error } = useCreateChat(currentGroupId)

	// Не показываем себя в списке (обычно ожидаемо)
	const list = useMemo(
		() => members.filter(m => String(m.id) !== String(user?.id)),
		[members, user]
	)

	const isSelected = (id: IGroupMember['id']) =>
		selected.some(s => String(s.id) === String(id))

	const addMember = (m: IGroupMember) => {
		if (isSelected(m.id)) return
		if (chatType === 'direct') {
			setSelected([m])
		} else {
			setSelected(prev => [...prev, m])
		}
	}

	const removeMember = (id: IGroupMember['id']) => {
		setSelected(prev => prev.filter(s => String(s.id) !== String(id)))
	}

	const canSubmit =
		chatType === 'direct'
			? selected.length === 1
			: selected.length >= 2 && title.trim().length > 0

	const resetState = () => {
		setChatType('group')
		setTitle('')
		setQuery('')
		setSelected([])
	}

	const handleClose = () => {
		resetState()
		onClose()
	}

	const handleCreate = async () => {
		if (!canSubmit || !currentGroupId) return

		const participants = selected.map(s => s.id)
		const payload =
			chatType === 'direct'
				? { type: 'direct' as const, participants }
				: { type: 'group' as const, title: title.trim(), participants }

		try {
			await createChat(payload)
			handleClose()
		} catch (e) {
			console.error(e)
		}
	}

	if (!isOpen) return null

	return (
		<ModalWrapper
			isOpen={isOpen}
			onClose={handleClose}
			className='max-w-[880px]'
		>
			<div className='flex items-start justify-between'>
				<h2 className='text-2xl font-semibold'>Создать чат</h2>
				<button
					type='button'
					onClick={handleClose}
					className='absolute top-4 right-4 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
					aria-label='Закрыть'
				>
					<X className='w-5 h-5' />
				</button>
			</div>

			<div className='mt-4 h-px bg-border' />

			<div className='mt-6 grid grid-cols-2 gap-6'>
				{/* Левая колонка */}
				<div>
					<div className='mb-2 text-sm font-medium text-foreground'>
						Тип чата
					</div>
					<div className='inline-flex rounded-xl border border-border bg-background p-1 mb-4 shadow-sm'>
						<button
							type='button'
							onClick={() => setChatType('group')}
							className={[
								'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
								chatType === 'group'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							].join(' ')}
						>
							Беседа
						</button>
						<button
							type='button'
							onClick={() => {
								setChatType('direct')
								setSelected(prev => (prev[0] ? [prev[0]] : []))
							}}
							className={[
								'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
								chatType === 'direct'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							].join(' ')}
						>
							Личный
						</button>
					</div>

					{chatType === 'group' && (
						<>
							<div className='mb-2 text-sm font-medium text-foreground'>
								Название беседы
							</div>
							<Field
								placeholder='Команда маркетинга'
								value={title}
								onChange={e => setTitle(e.target.value)}
								className='mb-2'
							/>
						</>
					)}

					{!!selected.length && (
						<div className='flex flex-wrap gap-2'>
							{selected.map(s => (
								<span
									key={s.id}
									className='inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1.5 text-sm border border-border'
								>
									<span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold'>
										{String(s.name ?? s.email)
											.charAt(0)
											.toUpperCase()}
									</span>
									{s.name ?? s.email}
									<button
										type='button'
										onClick={() => removeMember(s.id)}
										className='rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
										aria-label='remove'
									>
										<X className='w-4 h-4' />
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				{/* Правая колонка */}
				<div>
					<div className='mb-2 text-sm font-medium text-foreground'>
						Участники
					</div>
					<Field
						placeholder='Поиск по имени или почте…'
						value={query}
						onChange={e => setQuery(e.target.value)}
						leftIcon={Search}
						rightIcon={X}
						onRightIconClick={() => setQuery('')}
						className='mb-3'
					/>

					<div className='max-h-80 overflow-y-auto pe-1'>
						{isLoading || isFetching ? (
							<div className='text-sm text-muted-foreground'>Загрузка…</div>
						) : list.length ? (
							<ul className='space-y-2'>
								{list.map(u => {
									const active = isSelected(u.id)
									const disabled =
										chatType === 'direct' && selected.length === 1 && !active
									return (
										<li
											key={u.id}
											className='flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 transition-colors hover:bg-accent/60'
										>
											<div className='flex items-center gap-3'>
												<div className='h-9 w-9 rounded-full bg-muted flex items-center justify-center'>
													<span className='text-foreground font-medium'>
														{String(u.name ?? u.email)
															.charAt(0)
															.toUpperCase()}
													</span>
												</div>
												<div>
													<div className='text-sm font-medium'>
														{u.name ?? u.email}
													</div>
													<div className='text-xs text-muted-foreground'>
														{u.email}
													</div>
												</div>
											</div>

											{active ? (
												<button
													type='button'
													onClick={() => removeMember(u.id)}
													className='text-primary hover:underline text-sm'
												>
													Убрать
												</button>
											) : (
												<button
													type='button'
													onClick={() => addMember(u)}
													disabled={disabled}
													className={[
														'text-primary hover:underline text-sm',
														disabled
															? 'opacity-40 cursor-not-allowed hover:no-underline'
															: ''
													].join(' ')}
												>
													Добавить
												</button>
											)}
										</li>
									)
								})}
							</ul>
						) : (
							<div className='text-sm text-muted-foreground'>
								Ничего не найдено.
							</div>
						)}
					</div>
				</div>
			</div>

			{!!error && (
				<div className='mt-3 text-sm text-destructive'>
					{(error as any)?.message ?? 'Не удалось создать чат'}
				</div>
			)}

			<div className='mt-6 flex justify-end gap-3'>
				<Button
					variant='secondary'
					onClick={handleClose}
					disabled={isPending}
				>
					Отмена
				</Button>
				<Button
					variant='default'
					type='button'
					disabled={!canSubmit || isPending}
					onClick={handleCreate}
				>
					{isPending ? 'Создаю…' : 'Создать чат'}
				</Button>
			</div>
		</ModalWrapper>
	)
}
