export const AREA_OPTIONS = [
	{ value: 'all', label: 'Все области' },
	{ value: 'space', label: 'Пространства' },
	{ value: 'task', label: 'Задачи' },
	{ value: 'column', label: 'Колонки' },
	{ value: 'participants', label: 'Участники' }
]

export const ACTION_OPTIONS = [
	{ value: 'all', label: 'Все действия' },
	{ value: 'created', label: 'Создание' },
	{ value: 'updated', label: 'Изменение' },
	{ value: 'deleted', label: 'Удаление' }
]

export const ACTION_TEXT_MAP: Record<string, string> = {
	created: 'создал',
	updated: 'обновил',
	deleted: 'удалил',
	invited: 'пригласил',
	order_updated: 'изменил порядок',
	renamed: 'переименовал',
	column_changed: 'переместил',
	description_updated: 'обновил описание',
	status_updated: 'обновил статус',
	priority_updated: 'обновил приоритет',
	due_date_updated: 'обновил срок',
	assignee_updated: 'обновил ответственного',
	checklist_created: 'создал чек-лист',
	checklist_updated: 'обновил чек-лист',
	checklist_deleted: 'удалил чек-лист',
	checklist_item_created: 'добавил пункт',
	checklist_item_updated: 'обновил пункт',
	checklist_item_deleted: 'удалил пункт'
}
