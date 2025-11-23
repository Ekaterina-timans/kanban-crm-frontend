import { formatActivityDateTime, formatDateForCard } from '@/utils/date-utils'

import { getUserNameById } from '../utils'

interface ChecklistItemHistoryProps {
	item: any
	members: any[]
	location: string
	userName: string
}

export function ChecklistItemHistory({
	item,
	members,
	location,
	userName
}: ChecklistItemHistoryProps) {
	const c = item.changes

	// ✅ ПУНКТ СОЗДАН
	if (item.action === 'checklist_item_created') {
		const name = c.name ?? c.new?.name ?? c.old?.name ?? ''

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> добавил пункт «{name}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// ✅ ПУНКТ ОБНОВЛЁН
	if (item.action === 'checklist_item_updated') {
		const oldItem = c.old
		const newItem = c.new

		let title = '' // первая строка (что сделал пользователь)
		let changeText = '' // строка после "Изменено: ..."

		// 1. Изменилось имя
		if (oldItem.name !== newItem.name) {
			title = `переименовал пункт «${oldItem.name}»`
			changeText = `наименование «${newItem.name}»`
		}

		// 2. Изменился ответственный
		else if (oldItem.assignee_id !== newItem.assignee_id) {
			const oldAssignee = getUserNameById(oldItem.assignee_id, members)
			const newAssignee = getUserNameById(newItem.assignee_id, members)

			title = `обновил ответственного «${oldAssignee}» за пункт`
			changeText = `новый ответственный «${newAssignee}»`
		}

		// 3. Изменился срок выполнения
		else if (oldItem.due_date !== newItem.due_date) {
			const oldDate = oldItem.due_date
				? formatDateForCard(oldItem.due_date)
				: null

			const newDate = newItem.due_date
				? formatDateForCard(newItem.due_date)
				: 'не задан'

			// Если старый срок был – выводим его
			if (oldDate) {
				title = `обновил срок выполнения «${oldDate}» пункта «${oldItem.name}»`
			} else {
				// если старого не было
				title = `обновил срок выполнения пункта «${oldItem.name}»`
			}

			changeText = `срок выполнения «${newDate}»`
		}

		// 4. Изменился статус выполнения
		else if (oldItem.completed !== newItem.completed) {
			const statusText = newItem.completed ? 'выполнено' : 'не выполнено'

			title = `обновил статус выполнения пункта «${oldItem.name}»`
			changeText = `статус выполнения «${statusText}»`
		}

		// fallback
		else {
			title = `обновил пункт «${oldItem.name}»`
			changeText = 'данные обновлены'
		}

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> {title}
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-sm text-gray-700 mt-1'>Изменено: {changeText}</p>

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// ✅ ПУНКТ УДАЛЁН
	if (item.action === 'checklist_item_deleted') {
		const name = c.name ?? c.old?.name ?? ''

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> удалил пункт «{name}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	return null
}
