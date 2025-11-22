import { useQuery } from '@tanstack/react-query'

import { taskService } from '@/services/task.service'

export function useTask(taskId?: string | number) {
	return useQuery({
	  queryKey: ['task',  String(taskId)],
	  queryFn: () => taskService.getTask(String(taskId!)),
	  enabled: !!taskId,
	  retry: false
	})
}
