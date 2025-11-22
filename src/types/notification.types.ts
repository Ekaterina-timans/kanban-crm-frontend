import { IBase } from "./root.types"

export interface INotification extends IBase {
  type: string
  data: {
    invitation_id: number
    group_id: number
    group_name: string
    group_description: string
    inviter_id: number
    inviter_name: string
    inviter_email: string
    role: string
    token: string
    status: string
    created_at: string
  }
  read_at: string | null
}