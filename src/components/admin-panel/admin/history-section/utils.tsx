import { formatDateForCard } from '@/utils/date-utils'

export function getLocation(c: any): string {
	return [
		c?.space_name && `в пространстве «${c.space_name}»`,
		c?.column_name && `в колонке «${c.column_name}»`,
		c?.task_name && `в задаче «${c.task_name}»`,
		c?.checklist_title && `в чек-листе «${c.checklist_title}»`
	]
		.filter(Boolean)
		.join(' → ')
}

export function getOldName(item: any) {
	const c = item.changes
	if (!c) return ''

	if (item.action === 'renamed') return c.old || ''
	if (item.action === 'checklist_updated') return c.old_title || ''
	if (item.action === 'checklist_item_updated') return c.old?.name || ''

	if (c.name) return c.name
	if (c.task_name) return c.task_name
	if (c.column_name) return c.column_name
	if (c.old?.name) return c.old.name

	return ''
}

export function getNewName(item: any) {
	const c = item.changes
	if (!c) return ''

	if (item.action === 'renamed') return c.new || ''
	if (item.action === 'checklist_updated') return c.new_title || ''
	if (item.action === 'checklist_item_updated') return c.new?.name || ''
	if (c.new?.name) return c.new.name

	return ''
}

export function getUserNameById(id: number, members: any[]) {
	const user = members.find(m => m.id === id)
	if (!user) return `#${id}`
	return user.name || user.email || `#${id}`
}

export function formatOldNewDate(value: string | null) {
	return value ? formatDateForCard(value) : 'не задан'
}

export function extractChangedFields(c: any): string[] {
	if (!c?.old || !c?.new) return []
	const out: string[] = []
	for (const key of Object.keys(c.old)) {
		if (c.old[key] !== c.new[key]) out.push(key)
	}
	return out
}

export function humanFieldName(key: string): string {
	const map: Record<string, string> = {
		name: 'наименование',
		color: 'цвет',
		position: 'позицию',
		status_id: 'статус',
		priority_id: 'приоритет',
		due_date: 'срок',
		assignee_id: 'ответственного',
		description: 'описание',
		background_color: 'фон'
	}
	return map[key] || key
}
