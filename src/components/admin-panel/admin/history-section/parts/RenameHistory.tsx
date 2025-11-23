import { formatActivityDateTime } from '@/utils/date-utils'

import { getNewName } from '../utils'

interface RenameHistoryProps {
	item: any
	userName: string
	location: string
	entity: string
	actionText: string
}

export function RenameHistory({
	item,
	userName,
	location,
	entity,
	actionText
}: RenameHistoryProps) {
	const newName = getNewName(item)

	return (
		<div className='flex items-start gap-3'>
			<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
			<div>
				<p>
					<strong>{userName}</strong> {actionText} {entity}
				</p>

				{location && <p className='text-gray-600 text-sm'>{location}</p>}

				<p className='text-sm text-gray-700 mt-1'>
					Изменено: наименование «{newName}»
				</p>

				<p className='text-gray-500 text-sm mt-1'>
					{formatActivityDateTime(item.created_at)}
				</p>
			</div>
		</div>
	)
}
