import { PriorityId, StatusId } from '@/types/task.types'

import { priorities, statuses } from '@/config/data.config'

import { formatActivityDateTime } from '@/utils/date-utils'

interface StatusPriorityHistoryProps {
	item: any
	userName: string
	location: string
}

export function StatusPriorityHistory({
	item,
	userName,
	location
}: StatusPriorityHistoryProps) {
	const c = item.changes

	// 🔥 ОБНОВЛЕНИЕ СТАТУСА
	if (item.action === 'status_updated') {
		const oldStatus = statuses[c.old as StatusId] ?? c.old
		const newStatus = statuses[c.new as StatusId] ?? c.new

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> обновил статус «{oldStatus}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-sm text-gray-700 mt-1'>
						Изменено: статус «{newStatus}»
					</p>

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// 🔥 ОБНОВЛЕНИЕ ПРИОРИТЕТА
	if (item.action === 'priority_updated') {
		const oldPriority = priorities[c.old as PriorityId] ?? c.old
		const newPriority = priorities[c.new as PriorityId] ?? c.new

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> обновил приоритет «{oldPriority}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-sm text-gray-700 mt-1'>
						Изменено: приоритет «{newPriority}»
					</p>

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	return null
}
