import { groupInvitationsService } from '@/services/group-invitations.service'
import { IGroupInvitation } from '@/types/group-invititations.types'
import { useQuery } from '@tanstack/react-query'


export function useGroupInvitations(groupId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['group invitations', groupId],
    queryFn: () => groupInvitationsService.getGroupInvitations(groupId as string),
    enabled: !!groupId
  })

  return {
    invitations: data?.data as IGroupInvitation[] || [],
    isLoading
  }
}
