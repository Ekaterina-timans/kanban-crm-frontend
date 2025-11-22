import { IGroup } from "./group.types"
import { IUser } from "./user.types"

export interface IAuthForm {
	email: string
	password: string
}

export interface IAuthResponse {
	user: IUser
	groups: IGroup[]
}