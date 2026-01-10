import { IColumnTask } from './column.types'
import { IBase } from './root.types'

export interface ISpaceResponse extends IBase {
	groupId: string
	name: string
	description?: string
	backgroundImage?: File | null
	backgroundColor?: string
	space_users?: {
		id: number
		user: {
			id: number
			name: string | null
			email: string
			avatar?: string | null
		}
	}[]
}

export type TypeSpaceFormState = Partial<
	Omit<ISpaceResponse, 'id' | 'updatedAt'>
>

export interface ISpaceIdResponse extends ISpaceResponse {
	columns: IColumnTask[];
}

export interface ISpaceProjectProps {
	spaces: ISpaceResponse[]
  selectedSpaceId: string | null
  onSelectSpace: (id: string) => void
  loading?: boolean
}

export type TaskSortField = 'created_at' | 'due_date'
export type SortOrder = 'asc' | 'desc'

export interface ITaskFilters {
	task_q?: string
	assignee_id?: number
	status_id?: number
	priority_id?: number
	due_from?: string
	due_to?: string

	task_sort?: TaskSortField
	task_order?: SortOrder
}