import { useAuth } from "@/providers/AuthProvider"
import { activityService } from "@/services/activity.service"
import { useQuery } from "@tanstack/react-query"

interface Filters {
  type: string
  userId?: string
  action?: string
  date?: string
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
        date: filters.date
      }).then(res => res.data)
  })
}