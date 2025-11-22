import { IBase } from "./root.types"

export interface IGroup extends IBase {
  name: string
  description?: string
  creator_id: number
  users?: any[]
  role?: 'admin' | 'member'
  pivot?: IGroupUserPivot
   invite_policy?: 'admin_only' | 'all'
}

export type TypeGroupFormState = Partial<Omit<IGroup, 'id' | 'updatedAt'>>

export interface IGroupUserPivot {
  user_id: number
  group_id: number
  role: 'admin' | 'member'
  created_at: string
  updated_at: string
}

export interface IGroupMember {
  id: number | string
  name: string | null
  email: string
  avatar?: string | null
  pivot: {
    role: "admin" | "member"
    status: "active" | "blocked"
    created_at: string
    updated_at: string
  }
}