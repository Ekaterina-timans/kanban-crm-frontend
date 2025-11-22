import { DASHBOARD_PAGES } from '@/config/page.url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		link: DASHBOARD_PAGES.STATISTICS,
		name: 'Статистика'
	},
	{
		link: DASHBOARD_PAGES.PROJECTS,
		name: 'Проекты'
	},
	// {
	// 	link: DASHBOARD_PAGES.TASKS,
	// 	name: 'Задачи'
	// },
	{
		link: DASHBOARD_PAGES.CHATS,
		name: 'Чаты'
	},
	{
		link: DASHBOARD_PAGES.ADMIN_PANEL,
		name: 'Административная панель'
	}
]
