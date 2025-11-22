import { useQuery } from '@tanstack/react-query'
import { groupInvitationsService } from '@/services/group-invitations.service'
import { IGroupInvitation } from '@/types/group-invititations.types'

export function useUserGroupInvitations() {
  return useQuery<IGroupInvitation[]>({
    queryKey: ['user group invitations'],
    queryFn: () => groupInvitationsService.getUserInvitations(),
  })
}