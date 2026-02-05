'use client'

import React from 'react'

import { TabName } from '@/types/components.types'
import { INotification } from '@/types/notification.types'

import { useGroupInvitationsModal } from '@/store/useGroupInvitationsModal'

export type NotificationAction =
	| string
	| ((n: INotification, close: () => void) => void | string)

export interface NotificationViewConfig {
	renderTitle: (n: INotification) => React.ReactNode
	renderDescription?: (n: INotification) => React.ReactNode
	action: NotificationAction
}

/**
 * Хелпер: достаём значения из data, независимо от того,
 * как оно пришло (snake_case / camelCase).
 */
function pick<T = any>(obj: any, keys: string[], fallback?: T): T {
	for (const k of keys) {
		const v = obj?.[k]
		if (v !== undefined && v !== null && v !== '') return v as T
	}
	return fallback as T
}

function taskModalLinkFromNotification(n: INotification): string | null {
	const d: any = n.data ?? {}
	const taskId = pick<number | string>(d, ['task_id', 'taskId'])
	if (!taskId) return null

	return `/projects?taskId=${taskId}`
}

function chatLinkFromNotification(n: INotification): string | null {
	const d: any = n.data ?? {}

	const chatId = pick<number | string>(d, ['chat_id', 'chatId'])
	if (!chatId) return null

	// Чтобы прокрутить к сообщению (если есть)
	const messageId = pick<number | string>(d, ['message_id', 'messageId'])
	if (messageId) return `/chats?chatId=${chatId}&messageId=${messageId}`

	return `/chats?chatId=${chatId}`
}

export const notificationsConfig: Record<string, NotificationViewConfig> = {
	/**
	 * Приглашение в группу (всегда in-app)
	 * type в нотификации у тебя сейчас: "App\\Notifications\\GroupInviteNotification"
	 */
	'App\\Notifications\\GroupInviteNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const inviter =
				pick(d, ['inviter_name', 'inviterName']) ||
				pick(d, ['inviter_email', 'inviterEmail'])
			const groupName = pick(d, ['group_name', 'groupName'], 'группу')
			return (
				<span>
					{inviter} пригласил(а) вас в группу &quot;{groupName}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const descr = pick<string | null>(
				d,
				['group_description', 'groupDescription'],
				null
			)
			return descr ? <span>{descr}</span> : null
		},
		action: (_n, close) => {
			useGroupInvitationsModal.getState().open('invitations' as TabName)
			close()
		}
	},

	/**
	 * Назначили на задачу (in-app)
	 * Если у тебя другой FQCN — поменяй ключ.
	 */
	'App\\Notifications\\TaskAssignedInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const taskTitle = pick(d, ['task_name'], 'задачу')
			return (
				<span>
					{fromName} назначил(а) вам задачу: &quot;{taskTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const due = pick<string | null>(d, ['due_date'], null)
			return due ? <span>Дедлайн: {due}</span> : null
		},
		action: n => taskModalLinkFromNotification(n) || ''
	},

	/**
	 * Новое сообщение в чате (in-app)
	 */
	'App\\Notifications\\ChatMessageInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const chatTitle = pick(d, ['chat_title'], 'чат')
			return (
				<span>
					{fromName}: новое сообщение в &quot;{chatTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const text = pick<string | null>(d, ['text', 'message', 'content'], null)
			return text ? <span>{text}</span> : null
		},
		action: n => chatLinkFromNotification(n) || ''
	},

	/**
	 * Упоминание в чате (in-app)
	 */
	'App\\Notifications\\ChatMentionInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const chatTitle = pick(d, ['chat_title'], 'чате')
			return (
				<span>
					{fromName} упомянул(а) вас в &quot;{chatTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const text = pick<string | null>(d, ['text', 'message', 'content'], null)
			return text ? <span>{text}</span> : null
		},
		action: n => chatLinkFromNotification(n) || ''
	},

	/**
	 * Упоминание в комментарии (in-app)
	 */
	'App\\Notifications\\CommentMentionInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const taskTitle = pick(d, ['task_name'], 'задаче')
			return (
				<span>
					{fromName} упомянул(а) вас в комментарии к &quot;{taskTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const text = pick<string | null>(d, ['text', 'comment', 'content'], null)
			return text ? <span>{text}</span> : null
		},
		action: n => taskModalLinkFromNotification(n) || ''
	},

	/**
	 * Комментарий к моей задаче (in-app)
	 */
	'App\\Notifications\\CommentOnMyTaskInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const taskTitle = pick(d, ['task_name'], 'задаче')
			return (
				<span>
					{fromName}: новый комментарий к вашей задаче &quot;{taskTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const text = pick<string | null>(d, ['text', 'comment', 'content'], null)
			return text ? <span>{text}</span> : null
		},
		action: n => taskModalLinkFromNotification(n) || ''
	},

	/**
	 * Комментарий к задаче, где я ответственная (in-app)
	 */
	'App\\Notifications\\CommentOnAssignedTaskInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const fromName = pick(d, ['from_user_email'], 'Кто-то')
			const taskTitle = pick(d, ['task_name'], 'задаче')
			return (
				<span>
					{fromName}: новый комментарий к задаче &quot;{taskTitle}&quot;
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const text = pick<string | null>(d, ['text', 'comment', 'content'], null)
			return text ? <span>{text}</span> : null
		},
		action: n => taskModalLinkFromNotification(n) || ''
	},

	/**
	 * Напоминание о дедлайне (in-app)
	 */
	'App\\Notifications\\DeadlineReminderInAppNotification': {
		renderTitle: n => {
			const d: any = n.data ?? {}
			const taskTitle = pick(d, ['task_name'], 'задаче')
			const days = pick<number | string | null>(d, ['days_before'], null)
			return (
				<span>
					Дедлайн скоро: &quot;{taskTitle}&quot;
					{days !== null ? ` (за ${days} дн.)` : ''}
				</span>
			)
		},
		renderDescription: n => {
			const d: any = n.data ?? {}
			const due = pick<string | null>(d, ['due_date', 'dueDate'], null)
			return due ? <span>Срок: {due}</span> : null
		},
		action: n => taskModalLinkFromNotification(n) || ''
	},

	/**
	 * fallback
	 */
	default: {
		renderTitle: () => <span>Уведомление</span>,
		action: () => {}
	}
}
