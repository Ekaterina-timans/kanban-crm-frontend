import { useQuery } from '@tanstack/react-query'

import { PeriodParams } from '@/components/ui/period-select/period'

import { useAuth } from '@/providers/AuthProvider'

import {
	ChecklistStats,
	HourActivity,
	TaskPriorities,
	TaskStatuses,
	TasksStats
} from '@/types/statistics.types'

import { statisticsPersonalService } from '@/services/statistics-personal.service'

export type WidgetKey =
	| 'tasks'
	| 'task_statuses'
	| 'task_priorities'
	| 'checklist'
	| 'hour_activity'
	| 'productivity_index'
	| 'checklist_progress'

type WidgetDataMap = {
	tasks: TasksStats
	task_statuses: TaskStatuses
	task_priorities: TaskPriorities
	checklist: ChecklistStats
	hour_activity: HourActivity
	productivity_index: number
	checklist_progress: ChecklistStats
}

export function useWidgetStatistics<K extends WidgetKey>(
	widget: K,
	period: PeriodParams
) {
	const { currentGroupId, user } = useAuth()

	return useQuery<WidgetDataMap[K]>({
		queryKey: ['widget', widget, currentGroupId, user?.id, period],
		enabled: !!currentGroupId && !!user?.id,
		queryFn: async (): Promise<WidgetDataMap[K]> => {
			const groupId = currentGroupId!
			const userId = Number(user!.id)

			switch (widget) {
				case 'tasks':
					return (await statisticsPersonalService.getTasks(groupId, userId, period))
						.data as WidgetDataMap[K]

				case 'task_statuses':
					return (
						await statisticsPersonalService.getTaskStatuses(groupId, userId, period)
					).data as WidgetDataMap[K]

				case 'task_priorities':
					return (
						await statisticsPersonalService.getTaskPriorities(groupId, userId, period)
					).data as WidgetDataMap[K]

				case 'checklist':
					return (await statisticsPersonalService.getChecklist(groupId, userId, period))
						.data as WidgetDataMap[K]

				case 'hour_activity':
					return (
						await statisticsPersonalService.getHourActivity(groupId, userId, period)
					).data as WidgetDataMap[K]

				case 'productivity_index':
					return (
						await statisticsPersonalService.getProductivity(groupId, userId, period)
					).data as WidgetDataMap[K]

				case 'checklist_progress':
					return (await statisticsPersonalService.getProgress(groupId, userId)).data
						.checklist as WidgetDataMap[K]

				default:
					throw new Error('Unknown widget type: ' + widget)
			}
		}
	})
}
