import { groupService } from "@/services/group.service"
import { IGroupMember } from "@/types/group.types"
import { useQuery } from "@tanstack/react-query"

export function useGroupMembers(
  groupId: string | number | null,
  q: string,
  isOpen: boolean
) {
  const enabled =
    !!groupId &&
    isOpen &&
    (q.length === 0 || q.length >= 2)

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['group-members', groupId, q],
    queryFn: () => groupService.getGroupMembers(String(groupId), q),
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  })

  return {
    members: (data ?? []) as IGroupMember[],
    isLoading, // первая загрузка
    isFetching, // последующие обновления (поиск)
    isError,
  }
}