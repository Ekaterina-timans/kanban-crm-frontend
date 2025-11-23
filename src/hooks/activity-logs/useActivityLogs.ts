import { useAuth } from "@/providers/AuthProvider"
import { activityService } from "@/services/activity.service"
import { useQuery } from "@tanstack/react-query"

interface Filters {
  type?: string
  userId?: string
  action?: string,
  action_group?: string,
  date?: string
  page: number
  limit: number
}

export function useActivityLogs(filters: Filters) {
  const { currentGroupId } = useAuth()

  return useQuery({
    queryKey: ['activity-logs', currentGroupId, filters],
    enabled: !!currentGroupId,
    queryFn: () =>
      activityService.getLogs({
        group_id: currentGroupId!,
        entity_type: filters.type !== 'all' ? filters.type : undefined,
        user_id: filters.userId,
        action: filters.action,
        action_group: filters.action_group,
        date: filters.date,
        page: filters.page,
        limit: filters.limit
      }).then(res => res.data)
  })
}