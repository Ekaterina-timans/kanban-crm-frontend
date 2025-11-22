import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { groupInvitationsService } from '@/services/group-invitations.service'

export function useDeclineGroupInvitation() {
  const queryClient = useQueryClient()
  const { mutate: declineInvitation, isPending: isDeclining } = useMutation({
    mutationFn: (token: string) =>
      groupInvitationsService.declineInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user group invitations'] })
      toast.success('Приглашение отклонено')
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Ошибка отклонения приглашения'),
  })

  return { declineInvitation, isDeclining }
}
