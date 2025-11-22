import { IBase } from "./root.types"

export interface IChecklist extends IBase {
	task_id: string
	title: string
	items?: IChecklistItem[]
}

export interface IChecklistItem extends IBase {
	checklist_id: string
	name: string
	assignee_id?: string | null
	completed: boolean
	due_date?: string | null
}

export type TypeChecklistFormState = Partial<Omit<IChecklist, 'id' | 'updatedAt'>>

export type TypeChecklistItemFormState = Partial<Omit<IChecklistItem, 'id' | 'updatedAt'>>