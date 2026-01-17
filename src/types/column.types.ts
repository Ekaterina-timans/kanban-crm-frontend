import { IBase } from './root.types'
import { ITask } from './task.types'

export interface IColumn extends IBase {
	space_id: string
	name: string
	color: string
	position: number
	tasks_count: number
}

export interface IColumnTask extends IColumn {
	tasks: ITask[]
}

export interface IColumnPosition {
	id: string
	position: number
}

export type TypeColumnFormState = Partial<Omit<IColumn, 'id' | 'updatedAt'>>
