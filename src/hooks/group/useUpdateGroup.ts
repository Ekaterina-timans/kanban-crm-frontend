import { groupService } from "@/services/group.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useUpdateGroup(groupId: string) {
	const queryClient = useQueryClient()

	const { mutateAsync: updateGroup, isPending } = useMutation({
    mutationFn: (data: any) => groupService.updateGroup(groupId, data),
    onSuccess() {
      toast.success('Настройки обновлены!')

      queryClient.invalidateQueries({ queryKey: ['group', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message ?? 'Ошибка сохранения')
    }
  })

  return { updateGroup, isPending }
}