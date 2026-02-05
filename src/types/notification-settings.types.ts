export interface INotificationSettings {
	id: number
	user_id: number

	// In-app (bell)
	inapp_chat_messages: boolean
	inapp_mentions: boolean
	inapp_task_assigned: boolean
	inapp_comments_on_my_tasks: boolean
	inapp_comments_on_assigned_tasks: boolean
	inapp_deadline_reminders: boolean

	// Email
	email_chat_messages: boolean
	email_task_assigned: boolean
	email_comments_on_my_tasks: boolean
	email_comments_on_assigned_tasks: boolean
	email_deadline_reminders: boolean

	// Deadline extras
	deadline_days_before: number
	deadline_notify_time: string // "HH:mm"

	created_at: string
	updated_at: string
}
