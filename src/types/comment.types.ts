import { IBase } from "./root.types"

export interface IComment extends IBase {
	task_id: string
	user_id: string
	content: string
	user?: {
		id: string
		name?: string
		email?: string
		avatar?: string | null
	}
}

export type TypeCommentFormState = Pick<IComment, 'content'>