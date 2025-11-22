export interface PermissionCategory {
	category: string
	systemCategory: string
	permissions: {
		read: boolean
		create?: boolean
		edit?: boolean
		delete?: boolean
		all?: boolean
	}
}