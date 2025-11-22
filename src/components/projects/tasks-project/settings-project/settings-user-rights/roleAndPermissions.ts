import { PermissionCategory } from '@/types/permission.type'

export const roleOptions = [
	{ value: 'owner', label: 'Администратор' },
	{ value: 'editor', label: 'Редактор' },
	{ value: 'viewer', label: 'Просмотр' }
]

export const defaultPermissions: PermissionCategory[] = [
	{
		category: 'Пространства',
		systemCategory: 'space',
		permissions: {
			read: true,
			edit: true,
			delete: true
		}
	},
	{
		category: 'Колонки',
		systemCategory: 'column',
		permissions: {
			read: true,
			create: true,
			edit: true,
			delete: true
		}
	},
	{
		category: 'Задачи',
		systemCategory: 'task',
		permissions: {
			read: true,
			create: true,
			edit: true,
			delete: false
		}
	},
	{
		category: 'Комментарии',
		systemCategory: 'comment',
		permissions: {
			read: true,
			create: true,
			delete: false
		}
	}
]
