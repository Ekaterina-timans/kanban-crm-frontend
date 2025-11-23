import { formatActivityDateTime } from '@/utils/date-utils'

interface Props {
	item: any
	userName: string
	location: string
}

export function ChecklistHistory({ item, userName, location }: Props) {
	const c = item.changes

	// СОЗДАНИЕ ЧЕК-ЛИСТА
	if (item.action === 'checklist_created') {
		const title = c.title ?? 'Без названия'

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> создал чек-лист «{title}»
					</p>

					{location && (
						<p className='text-gray-600 text-sm'>{location}</p>
					)}

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	// УДАЛЕНИЕ ЧЕК-ЛИСТА
	if (item.action === 'checklist_deleted') {
		const title = c.title ?? 'Без названия'

		return (
			<div className='flex items-start gap-3'>
				<div className='w-2 h-2 mt-2 bg-blue-500 rounded-full' />
				<div>
					<p>
						<strong>{userName}</strong> удалил чек-лист «{title}»
					</p>

					{location && (
						<p className='text-gray-600 text-sm'>{location}</p>
					)}

					<p className='text-gray-500 text-sm mt-1'>
						{formatActivityDateTime(item.created_at)}
					</p>
				</div>
			</div>
		)
	}

	return null
}