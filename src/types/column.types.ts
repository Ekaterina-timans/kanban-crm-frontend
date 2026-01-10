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
	// Blues / Indigo (спокойные, совместимы с primary)
  '#DDEBFF',
  '#CFE3FF',
  '#BFD7FF',
  '#A9CBFF',

  // Teal / Mint (подходит вашему канбану)
  '#D6F5EF',
  '#BFEFE4',
  '#A6E7D7',
  '#8BDEC8',

  // Warm (мягкие тёплые, не кислотные)
  '#FFE7C2',
  '#FFD7B3',
  '#FFE0E0',
  '#FFD1DD',

  // Violet / Lavender (мягко, без агрессии)
  '#EADFFF',
  '#DCCBFF',
  '#D8E7FF',
  '#E8F1FF'
]
