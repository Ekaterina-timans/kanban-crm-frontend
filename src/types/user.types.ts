export interface IUser {
  id: string
  email: string
  name?: string | null
  avatar?: string | FileList | null
  created_at: string
}

export interface IUserProfile extends IUser {
  password?: string
}

export interface IUserActual {
  current_group_id: string | null
  current_space_id: string | null
  timezone?: string | null
}

export interface ISpaceUser {
  id: number
  space_id: number
  user_id: number
  role: 'owner' | 'editor' | 'viewer'
  user: IUser
  permissions: {
    id: number
    name: string
    description?: string | null
  }[]
}