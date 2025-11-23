import { formatActivityDateTime, formatDateForCard } from '@/utils/date-utils'
import { getUserNameById } from '../utils'

interface DueAssigneeHistoryProps {
	item: any
	userName: string
	location: string
	members: any[]
}

export function DueAssigneeHistory({
	item,
	userName,
	location,
	members
}: DueAssigneeHistoryProps) {
	const c = item.changes

	// 🔥 ОБНОВЛЕНИЕ СРОКА (due_date)
	if (item.action === 'due_date_updated') {
		const oldDate = c.old ? formatDateForCard(c.old) : c.old
		const newDate = c.new ? formatDateForCard(c.new) : c.new

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> обновил срок выполнения «{oldDate}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-sm text-gray-700 mt-1'>
						Изменено: срок выполнения «{newDate}»
					</p>

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// 🔥 ОБНОВЛЕНИЕ ОТВЕТСТВЕННОГО
	if (item.action === 'assignee_updated') {
		const oldAssignee = getUserNameById(c.old, members)
		const newAssignee = getUserNameById(c.new, members)

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> обновил ответственного «{oldAssignee}»
					</p>

					{location && <p className='text-gray-600 text-sm'>{location}</p>}

					<p className='text-sm text-gray-700 mt-1'>
						Изменено: новый ответственный «{newAssignee}»
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
