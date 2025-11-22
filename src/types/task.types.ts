import { IBase } from "./root.types"

export type StatusId = 1 | 2 | 3

export type PriorityId = 1 | 2 | 3

export interface IAssignee {
	id: number
	name: string | null
	email: string
	avatar?: string | null
}

export interface ITask extends IBase {
  column_id: string
  name: string
  description?: string
  assignee_id?: number | null
  assignee?: IAssignee | null
  status_id: StatusId
  priority_id: PriorityId
  due_date?: string | null
}

export type TypeTaskFormState = Partial<
  Omit<ITask, 'id' | 'updatedAt'>
>