import { INotificationSettings } from '@/types/notification-settings.types'

export type NotificationSettingsForm = Pick<
	INotificationSettings,
	| 'email_chat_messages'
	| 'email_task_assigned'
	| 'email_comments_on_my_tasks'
	| 'email_comments_on_assigned_tasks'
	| 'email_deadline_reminders'
	| 'inapp_chat_messages'
	| 'inapp_mentions'
	| 'inapp_task_assigned'
	| 'inapp_comments_on_my_tasks'
	| 'inapp_comments_on_assigned_tasks'
	| 'inapp_deadline_reminders'
	| 'deadline_days_before'
	| 'deadline_notify_time'
>

export function mapSettingsToForm(
	settings: INotificationSettings
): NotificationSettingsForm {
	return {
		// Email
		email_chat_messages: settings.email_chat_messages,
		email_task_assigned: settings.email_task_assigned,
		email_comments_on_my_tasks: settings.email_comments_on_my_tasks,
		email_comments_on_assigned_tasks: settings.email_comments_on_assigned_tasks,
		email_deadline_reminders: settings.email_deadline_reminders,

		// In-app
		inapp_chat_messages: settings.inapp_chat_messages,
		inapp_mentions: settings.inapp_mentions,
		inapp_task_assigned: settings.inapp_task_assigned,
		inapp_comments_on_my_tasks: settings.inapp_comments_on_my_tasks,
		inapp_comments_on_assigned_tasks: settings.inapp_comments_on_assigned_tasks,
		inapp_deadline_reminders: settings.inapp_deadline_reminders,

		// Deadline
		deadline_days_before: settings.deadline_days_before ?? 1,
		deadline_notify_time: settings.deadline_notify_time ?? '09:00'
	}
}
