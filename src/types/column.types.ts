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

export const Colors = [
	'#EE82EE',
	'#FA8072',
	'#CD5C5C',
	'#9400D3',
	'#673AB7',
	'#3F51B5',
	'#008080',
	'#1E90FF',
	'#66CDAA',
	'#FFEB3B',
	'#FF8C00',
	'#9ACD32',
	'#32CD32',
	'#4CAF50',
	'#006400'
]
