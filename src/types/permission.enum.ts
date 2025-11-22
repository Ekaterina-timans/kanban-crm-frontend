export enum Permission {
	// --- Пространства ---
	SPACE_READ = 'space_read',
	SPACE_CREATE = 'space_create',
	SPACE_EDIT = 'space_edit',
	SPACE_DELETE = 'space_delete',

	// --- Колонки ---
	COLUMN_READ = 'column_read',
	COLUMN_CREATE = 'column_create',
	COLUMN_EDIT = 'column_edit',
	COLUMN_DELETE = 'column_delete',

	// --- Задачи ---
	TASK_READ = 'task_read',
	TASK_CREATE = 'task_create',
	TASK_EDIT = 'task_edit',
	TASK_DELETE = 'task_delete',

	// --- Комментарии ---
	COMMENT_READ = 'comment_read', // может читать только свои / публичные
	COMMENT_CREATE = 'comment_create',
	COMMENT_EDIT = 'comment_edit', // редактировать свои
	COMMENT_DELETE = 'comment_delete', // удалять свои
	COMMENT_ALL = 'comment_all'
}
