import { formatActivityDateTime } from '@/utils/date-utils'

import { ACTION_TEXT_MAP } from './constants'
import { ChecklistHistory } from './parts/ChecklistHistory'
import { ChecklistItemHistory } from './parts/ChecklistItemHistory'
import { DueAssigneeHistory } from './parts/DueAssigneeHistory'
import { RenameHistory } from './parts/RenameHistory'
import { StatusPriorityHistory } from './parts/StatusPriorityHistory'
import {
	extractChangedFields,
	getLocation,
	getNewName,
	getOldName,
	humanFieldName
} from './utils'

interface Props {
	item: any
	members: any[]
}

export function HistoryItem({ item, members }: Props) {
	const c = item.changes || {}
	const userName = item.user?.name || item.user?.email

	const actionText = ACTION_TEXT_MAP[item.action] || item.action
	const location = getLocation(c)

	// ПУНКТЫ ЧЕК-ЛИСТА (создан / обновлён / удалён)
	if (
		item.action === 'checklist_item_created' ||
		item.action === 'checklist_item_updated' ||
		item.action === 'checklist_item_deleted'
	) {
		return (
			<ChecklistItemHistory
				item={item}
				members={members}
				location={location}
				userName={userName}
			/>
		)
	}

	// ЧЕК-ЛИСТ (создан / удалён)
	if (
		item.action === 'checklist_created' ||
		item.action === 'checklist_deleted'
	) {
		return (
			<ChecklistHistory
				item={item}
				userName={userName}
				location={location}
			/>
		)
	}

	// СТАРОЕ / НОВОЕ ИМЯ + ENTITY (что обновили)
	const oldName = getOldName(item)
	const newName = getNewName(item)

	let entity = ''
	if (item.action !== 'order_updated') {
		switch (item.entity_type) {
			case 'space':
				entity = `пространство «${c?.space_name ?? c?.name ?? oldName ?? ''}»`
				break
			case 'column':
				entity = `колонку «${oldName}»`
				break
			case 'task':
				entity = `задачу «${oldName}»`
				break
			case 'participants':
				entity = `пользователя ${c?.email ?? ''}`
				break
			default:
				entity = oldName ? `«${oldName}»` : ''
		}
	}

	// ИЗМЕНЕНИЕ ПОРЯДКА КОЛОНОК
	if (item.action === 'order_updated') {
		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> изменил порядок колонок
					</p>
					{location && <p className='text-gray-600 text-sm'>{location}</p>}
					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// ПЕРЕИМЕНОВАНИЕ (задачи, чек-листы)
	if (item.action === 'renamed' || item.action === 'checklist_updated') {
		return (
			<RenameHistory
				item={item}
				userName={userName}
				location={location}
				entity={entity}
				actionText={actionText}
			/>
		)
	}

	// ОБНОВЛЕНИЕ СТАТУСА / ПРИОРИТЕТА
	if (item.action === 'status_updated' || item.action === 'priority_updated') {
		return (
			<StatusPriorityHistory
				item={item}
				userName={userName}
				location={location}
			/>
		)
	}

	// ОБНОВЛЕНИЕ СРОКА / ОТВЕТСТВЕННОГО
	if (
		item.action === 'due_date_updated' ||
		item.action === 'assignee_updated'
	) {
		return (
			<DueAssigneeHistory
				item={item}
				userName={userName}
				location={location}
				members={members}
			/>
		)
	}

	// ПРОЧИЕ ОБНОВЛЕНИЯ (в т.ч. колонки created/updated/deleted)
	const changed = extractChangedFields(c)
	const changedLabels = changed
		.filter(key => key !== 'name')
		.map(humanFieldName)

	const nameChanged = c?.new?.name && c?.old?.name && c.new.name !== c.old.name

	return (
		<div className='flex items-start gap-3'>
			<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
			<div>
				<p>
					<strong>{userName}</strong> {actionText} {entity}
				</p>

				{location && <p className='text-gray-600 text-sm'>{location}</p>}

				{/* Если изменилось имя + ещё что-то */}
				{nameChanged && (
					<p className='text-sm text-gray-700 mt-1'>
						Изменено: наименование «{newName}
						{changedLabels.length > 0 ? '», ' : '»'}
						{changedLabels.join(', ')}
					</p>
				)}

				{/* Если имя НЕ менялось — обычное перечисление */}
				{!nameChanged && changedLabels.length > 0 && (
					<p className='text-sm text-gray-700 mt-1'>
						Изменено: {changedLabels.join(', ')}
					</p>
				)}

				<p className='text-gray-500 text-sm mt-1'>
					{formatActivityDateTime(item.created_at)}
				</p>
			</div>
		</div>
	)
}
