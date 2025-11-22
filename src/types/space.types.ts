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