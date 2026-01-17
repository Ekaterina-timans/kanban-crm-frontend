import { SortOrder, TaskSortField } from '@/types/space.types'
import { ReactNode } from 'react'

export interface ITaskFiltersUI {
	task_q: string
	assignee_id: string
	status_id: string
	priority_id: string
	due_from: string
	due_to: string
	task_sort: TaskSortField
	task_order: SortOrder
}

export interface Option {
	value: string
	label: string
	icon?: ReactNode
}

export interface IHeading {
	name: string
	description?: string

	onSettingsClick?: () => void
	canOpenSettings?: boolean

	// filters UI
	isFiltersOpen: boolean
	onToggleFilters: () => void
	filters: ITaskFiltersUI
	appliedFilters: ITaskFiltersUI
	onChangeFilters: (patch: Partial<ITaskFiltersUI>) => void
	onApplyFilters: () => void
	onResetFilters: () => void

	assigneeOptions?: Option[]
	statusOptions?: Option[]
	priorityOptions?: Option[]
}

export const defaultTaskFiltersUI: ITaskFiltersUI = {
	task_q: '',
	assignee_id: '',
	status_id: '',
	priority_id: '',
	due_from: '',
	due_to: '',
	task_sort: 'created_at',
	task_order: 'desc'
}

export function countActiveFilters(f?: Partial<ITaskFiltersUI> | null) {
	if (!f) return 0

	let n = 0

	if ((f.task_q ?? '').trim()) n++
	if (f.assignee_id) n++
	if (f.status_id) n++
	if (f.priority_id) n++
	if (f.due_from) n++
	if (f.due_to) n++

	return n
}