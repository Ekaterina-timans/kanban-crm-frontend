'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { UserAvatar } from '@/components/ui/avatar/UserAvatar'
import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { useAuth } from '@/providers/AuthProvider'

import { ChatRole } from '@/types/chat.type'

import {
	useAddParticipants,
	useRemoveParticipant,
	useUpdateParticipantRole
} from '@/hooks/chat/useChatInfo'
import { useMyChatRole } from '@/hooks/chat/useMyChatRole'
import { useGroupMembers } from '@/hooks/group/useGroupMembers'

import { RoleBadge } from './RoleBadge'
import { RoleMenu } from './RoleMenu'

export function ParticipantsTab({
	chatId,
	permissions,
	participants
}: {
	chatId: string | number
	permissions: ReturnType<typeof useMyChatRole>['permissions']
	participants: Array<{
		id: number | string
		name?: string | null
		email: string
		avatar?: string | null
		role: ChatRole
	}>
}) {
	const updRole = useUpdateParticipantRole(chatId)
	const remove = useRemoveParticipant(chatId)
	const add = useAddParticipants(chatId)

	const { currentGroupId } = useAuth()
	const [adding, setAdding] = useState(false)
	const [input, setInput] = useState('')

	// сортировка: owner → admin → member, затем по имени/почте
	const sorted = useMemo(() => {
		const order: Record<ChatRole, number> = { owner: 0, admin: 1, member: 2 }
		return [...participants].sort((a, b) => {
			const byRole = order[a.role] - order[b.role]
			if (byRole !== 0) return byRole
			const la = (a.name || a.email || '').toLowerCase()
			const lb = (b.name || b.email || '').toLowerCase()
			return la.localeCompare(lb)
		})
	}, [participants])

	const onAdd = () => setAdding(v => !v)

	// e-mails уже в чате (не предлагать)
	const inChatEmails = useMemo(
		() => participants.map(p => (p.email || '').toLowerCase()),
		[participants]
	)

	// e-mails, уже набранные пользователем (несколько через запятую)
	const typedEmails = useMemo(
		() =>
			input
				.split(/[,\s]+/)
				.map(s => s.trim().toLowerCase())
				.filter(Boolean),
		[input]
	)

	// поисковый токен = последняя часть после запятой
	const searchToken = useMemo(() => {
		const parts = input.split(',')
		return (parts[parts.length - 1] ?? '').trim()
	}, [input])

	// автокомплит по участникам группы
	const { members, isFetching } = useGroupMembers(
		currentGroupId ?? null,
		searchToken,
		adding
	)

	// подсказки: убрать уже в чате и уже набранных
	const suggestions = useMemo(() => {
		const ban = new Set([...inChatEmails, ...typedEmails])
		const filtered = members.filter(
			m => !ban.has((m.email || '').toLowerCase())
		)
		// если нет ввода — показываем первые 50 (или сколько хочешь)
		return searchToken ? filtered : filtered.slice(0, 50)
	}, [members, inChatEmails, typedEmails, searchToken])

	// выбор подсказки -> подставляем email на место последнего токена
	const pickSuggestion = (email: string) => {
		const parts = input.split(',')
		parts[parts.length - 1] = ` ${email}`
		const next = parts
			.join(',')
			.replace(/\s+,/g, ',')
			.replace(/,\s+/g, ', ')
			.trim()
		setInput(next.endsWith(',') ? next : next + ', ')
	}

	const submitAdd = async () => {
		const emails = input
			.split(/[,\s]+/)
			.map(s => s.trim().toLowerCase())
			.filter(Boolean)

		if (!emails.length) return
		await add.mutateAsync({ emails, role: 'member' })
		setInput('')
		setAdding(false)
	}

	return (
		<div className='space-y-3'>
			{/* панель действий */}
			<div className='flex items-center justify-between'>
				<div className='text-xs text-slate-500'>
					Всего: {participants.length}
				</div>
				{permissions.canAddParticipant && (
					<Button
						variant='secondary'
						size='sm'
						onClick={onAdd}
						Icon={Plus}
					>
						Добавить
					</Button>
				)}
			</div>

			{adding && (
				<div className='flex items-center gap-2 relative'>
					<div className='flex-1'>
						<Field
							placeholder='E-mail участников через запятую'
							value={input}
							onChange={e => setInput(e.target.value)}
						/>
						{adding && (isFetching || suggestions.length >= 0) && (
							<div className='absolute z-50 top-full left-0 mt-1 w-full max-h-60 overflow-auto rounded border bg-white shadow'>
								{isFetching && (
									<div className='px-3 py-2 text-sm text-slate-500'>Поиск…</div>
								)}

								{!isFetching && suggestions.length === 0 && (
									<div className='px-3 py-2 text-sm text-slate-500'>
										Ничего не найдено
									</div>
								)}

								{!isFetching && suggestions.length > 0 && (
									<>
										{searchToken === '' && suggestions.length === 50 && (
											<div className='px-3 py-1 text-xs text-slate-500'>
												Показаны первые 50. Начните вводить для уточнения.
											</div>
										)}

										{suggestions.map(u => (
											<button
												key={u.id}
												type='button'
												onClick={() => pickSuggestion(u.email)}
												className='w-full text-left px-3 py-2 hover:bg-slate-100 focus:bg-slate-100 flex items-center gap-2'
											>
												<span className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs'>
													{(u.name || u.email || '?').slice(0, 1).toUpperCase()}
												</span>
												<span className='truncate'>{u.name ?? u.email}</span>
												{u.name && (
													<span className='ml-auto text-xs text-slate-500 truncate'>
														{u.email}
													</span>
												)}
											</button>
										))}
									</>
								)}
							</div>
						)}
					</div>
					<Button
						variant='default'
						size='sm'
						onClick={submitAdd}
						disabled={add.isPending}
					>
						{add.isPending ? 'Добавляю…' : 'Ок'}
					</Button>
				</div>
			)}

			{/* список */}
			<div className='mt-1 space-y-2'>
				{sorted.map(p => {
					const letter = (p.name || p.email || '?').slice(0, 1).toUpperCase()
					return (
						<div
							key={String(p.id)}
							className='flex items-center justify-between gap-3 rounded border px-3 py-2'
						>
							<div className='min-w-0 flex items-center gap-3'>
								<UserAvatar
									src={p.avatar}
									name={p.name ?? null}
									email={p.email}
									size={36}
									className='h-9 w-9'
									fallbackClassName='font-semibold text-base'
								/>
								<div className='min-w-0'>
									<div className='font-medium truncate'>
										{p.name ?? p.email}
									</div>
									{p.name && (
										<div className='text-xs text-slate-500 truncate'>
											{p.email}
										</div>
									)}
								</div>
							</div>

							<div className='flex items-center gap-2 shrink-0'>
								<RoleBadge role={p.role} />
								{permissions.canChangeRoles && p.role !== 'owner' && (
									<RoleMenu
										current={p.role}
										disabled={updRole.isPending}
										onChange={role => updRole.mutate({ user_id: p.id, role })}
									/>
								)}
								{permissions.canRemoveParticipant && p.role !== 'owner' && (
									<Button
										variant='outline'
										size='icon'
										title='Удалить из чата'
										onClick={() => remove.mutate({ user_id: p.id })}
										Icon={Trash2}
									/>
								)}
							</div>
						</div>
					)
				})}

				{!sorted.length && (
					<div className='text-sm text-slate-500'>Участников нет</div>
				)}
			</div>
		</div>
	)
}
