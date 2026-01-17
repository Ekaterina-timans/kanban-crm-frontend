import {
	priorities,
	priorityIcons,
	statusIcons,
	statuses
} from '@/constants/task-ui'

import { PriorityId, StatusId } from '@/types/task.types'

export const getStatusOptions = () =>
	Object.entries(statuses).map(([id, name]) => ({
		value: id,
		label: name,
		icon: statusIcons[parseInt(id) as StatusId]
	}))

export const getPriorityOptions = () =>
	Object.entries(priorities).map(([id, name]) => ({
		value: id,
		label: name,
		icon: priorityIcons[parseInt(id) as PriorityId]
	}))
