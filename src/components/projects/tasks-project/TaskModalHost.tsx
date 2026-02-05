'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { taskService } from '@/services/task.service'
import { TaskModalView } from './kanban-view/task/task-id/TaskModalView'
import { projectsUrl, taskModalUrl } from '@/config/page.url.config'


export function TaskModalHost() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const taskId = searchParams.get('taskId')
	const spaceIdFromUrl = searchParams.get('spaceId')

	const [resolvedSpaceId, setResolvedSpaceId] = useState<string | null>(null)

	useEffect(() => {
		if (!taskId) return

		// 1) spaceId уже есть в URL
		if (spaceIdFromUrl) {
			setResolvedSpaceId(spaceIdFromUrl)
			return
		}

		// 2) spaceId нет — получаем через задачу
		let cancelled = false;
    (async () => {
			try {
				const task = await taskService.getTask(String(taskId))

				const sid = task?.column?.space_id
				if (!sid || cancelled) return

				const sidStr = String(sid)
				setResolvedSpaceId(sidStr)

				// канонизируем URL
				router.replace(taskModalUrl(taskId, sidStr))
			} catch {}
		})()

		return () => {
			cancelled = true
		}
	}, [taskId, spaceIdFromUrl, router])

	if (!taskId) return null
	if (!resolvedSpaceId) return null

	const handleClose = () => {
		router.replace(projectsUrl(resolvedSpaceId))
	}

	return (
		<TaskModalView
			taskId={taskId}
			spaceId={resolvedSpaceId}
			isOpen={true}
			onClose={handleClose}
		/>
	)
}
