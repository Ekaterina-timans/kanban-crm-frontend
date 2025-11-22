import { IAssignee, PriorityId, StatusId } from './task.types'

export interface IGroupForm {
	name: string
	description?: string
}

export interface ISpaceForm {
	name: string
	description?: string
	backgroundImage?: FileList | null
	backgroundColor?: string
}

export interface IColumnForm {
	space_id: string
	name: string
	color: string
	position: number
}

export interface ITaskForm {
	column_id: string
	name: string
	description?: string
	assignee_id?: number | null
	status_id: StatusId
	priority_id: PriorityId
	due_date?: Date
}

export type IModalProps = {
	isOpen: boolean
	onClose: () => void
}
