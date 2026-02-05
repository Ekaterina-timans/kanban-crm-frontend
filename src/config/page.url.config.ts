class DASHBOARD {
	STATISTICS = '/statistics'
	PROJECTS = '/projects'
	CHATS = '/chats'
	ADMIN_PANEL = '/admin-panel'
	PROFILE = '/profile'
	NOTIFICATION_SETTINGS = '/notification-settings'
}

export const DASHBOARD_PAGES = new DASHBOARD()

export const projectsUrl = (spaceId?: string | number | null) => {
	if (spaceId === undefined || spaceId === null || spaceId === '') {
		return DASHBOARD_PAGES.PROJECTS
	}
	return `${DASHBOARD_PAGES.PROJECTS}?spaceId=${spaceId}`
}

export const taskModalUrl = (taskId: string | number, spaceId?: string | number | null) => {
	if (spaceId === undefined || spaceId === null || spaceId === '') {
		return `${DASHBOARD_PAGES.PROJECTS}?taskId=${taskId}`
	}
	return `${DASHBOARD_PAGES.PROJECTS}?spaceId=${spaceId}&taskId=${taskId}`
}
